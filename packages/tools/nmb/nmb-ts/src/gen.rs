pub mod hooks {
    use anyhow::Result;
    use ts_quote::{ts_string, TSSource, TS};

    #[derive(Debug, Clone)]
    pub struct HookConfig {
        pub native_module_name: String,
        pub method_name: String,
        pub return_type: String,
        pub params: Vec<Param>,
        pub strategy: HookGenerationStrategy,
        pub is_promise: bool,
    }

    #[derive(Debug, Clone)]
    pub struct Param {
        pub name: String,
        pub type_name: String,
    }

    #[derive(Debug, Clone, PartialEq)]
    pub enum HookGenerationStrategy {
        Direct,
        FunctionWrapper,
    }

    // ... (keep previous struct definitions)

    /// Generates React hook code based on specified strategy
    pub fn generate_hooks(config: &HookConfig) -> Result<String> {
        let HookConfig {
            native_module_name,
            method_name,
            return_type,
            params,
            strategy,
            is_promise,
        } = config;

        // Generate ALL identifiers first in Rust
        let pascal_case_name = format!("{}{}", method_name[..1].to_uppercase(), &method_name[1..]);
        let getter_name = format!("get{}", pascal_case_name);
        let hook_name = format!("use{}", pascal_case_name);
        let fetcher_name = format!("fetch{}", pascal_case_name);

        // Generate parameter signatures
        let params_signature = params
            .iter()
            .map(|p| format!("{}: {}", p.name, p.type_name))
            .collect::<Vec<_>>()
            .join(", ");
        let params_signature = params_signature.as_str();

        let params_call = params
            .iter()
            .map(|p| p.name.as_str())
            .collect::<Vec<_>>()
            .join(", ");
        let params_call = params_call.as_str();

        // Generate getter function
        let getter_function = ts_string! {
            export const #getter_name = (#params_signature): #return_type =>
                NativeModules.#native_module_name.#method_name(#params_call);
        };

        // Generate hook implementation
        let hook_code = match (strategy, *is_promise) {
            (HookGenerationStrategy::Direct, true) => generate_direct_promise_hook(
                &hook_name,
                &getter_name,
                return_type,
                params,
                params_signature,
                params_call,
            ),
            (HookGenerationStrategy::Direct, false) => generate_direct_sync_hook(
                &hook_name,
                &getter_name,
                return_type,
                params,
                params_signature,
                params_call,
            ),
            (HookGenerationStrategy::FunctionWrapper, true) => generate_wrapper_promise_hook(
                &hook_name,
                &fetcher_name,
                &getter_name,
                return_type,
                params_signature,
                params_call,
            ),
            (HookGenerationStrategy::FunctionWrapper, false) => generate_wrapper_sync_hook(
                &hook_name,
                &fetcher_name,
                &getter_name,
                return_type,
                params_signature,
                params_call,
            ),
        }?;

        // Combine all parts
        let full_code = ts_string! {
            #getter_function
            #hook_code
        };

        // Parse and format
        let parsed = TS::from_source(full_code)?;
        Ok(parsed.formatted(None)?)
    }

    fn generate_direct_promise_hook(
        hook_name: &str,
        getter_name: &str,
        return_type: &str,
        params: &[Param],
        params_signature: &str,
        params_call: &str,
    ) -> Result<String> {
        let dep_array = params
            .iter()
            .map(|p| p.name.as_str())
            .collect::<Vec<_>>()
            .join(", ");

        Ok(ts_string! {
            export const #hook_name = (#params_signature) => {
                const [value, setValue] = useState<#return_type>();
                const [loading, setLoading] = useState(false);
                const [error, setError] = useState<Error | null>(null);

                useEffect(() => {
                    let isMounted = true;
                    setLoading(true);

                    const fetchData = async () => {
                        try {
                            const result = await #getter_name(#params_call);
                            if (isMounted) {
                                setValue(result);
                                setError(null);
                            }
                        } catch (err) {
                            if (isMounted) {
                                setError(err instanceof Error ? err : new Error(String(err)));
                            }
                        } finally {
                            if (isMounted) {
                                setLoading(false);
                            }
                        }
                    };

                    fetchData();
                    return () => { isMounted = false; };
                }, [#dep_array]);

                return { value, loading, error };
            };
        }
        .to_string())
    }

    fn generate_wrapper_promise_hook(
        hook_name: &str,
        fetcher_name: &str,
        getter_name: &str,
        return_type: &str,
        params_signature: &str,
        params_call: &str,
    ) -> Result<String> {
        Ok(ts_string! {
            export const #hook_name = () => {
                const [value, setValue] = useState<#return_type>();
                const [loading, setLoading] = useState(false);
                const [error, setError] = useState<Error | null>(null);

                const #fetcher_name = useCallback(async (#params_signature) => {
                    setLoading(true);
                    try {
                        const result = await #getter_name(#params_call);
                        setValue(result);
                        setError(null);
                        return result;
                    } catch (err) {
                        setError(err instanceof Error ? err : new Error(String(err)));
                        throw err;
                    } finally {
                        setLoading(false);
                    }
                }, []);

                return { value, loading, error, fetch: #fetcher_name };
            };
        }
        .to_string())
    }

    fn generate_direct_sync_hook(
        hook_name: &str,
        getter_name: &str,
        return_type: &str,
        params: &[Param],
        params_signature: &str,
        params_call: &str,
    ) -> Result<String> {
        let dep_array = params
            .iter()
            .map(|p| p.name.as_str())
            .collect::<Vec<_>>()
            .join(", ");

        Ok(ts_string! {
            export const #hook_name = (#params_signature) => {
                const [value, setValue] = useState<#return_type>();

                useEffect(() => {
                    const fetchData = () => {
                        const result = #getter_name(#params_call);
                        setValue(result);
                    };

                    fetchData();
                }, [#dep_array]);

                return value;
            };
        }
        .to_string())
    }

    fn generate_wrapper_sync_hook(
        hook_name: &str,
        fetcher_name: &str,
        getter_name: &str,
        return_type: &str,
        params_signature: &str,
        params_call: &str,
    ) -> Result<String> {
        Ok(ts_string! {
            export const #hook_name = () => {
                const [value, setValue] = useState<#return_type>();

                const #fetcher_name = useCallback((#params_signature) => {
                    const result = #getter_name(#params_call);
                    setValue(result);
                    return result;
                }, []);

                return [value, #fetcher_name];
            };
        }
        .to_string())
    }
}
