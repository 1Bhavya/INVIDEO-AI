use wasm_bindgen::prelude::*;
use evalexpr::*;

#[wasm_bindgen]
pub fn calculate(input: &str) -> Result<f64, JsError> {
    web_sys::console::log_1(&format!("Input: {}", input).into());
    let result = eval(input)?;
    web_sys::console::log_1(&format!("Result: {:?}", result).into());
    match result {
        Value::Float(f) => Ok(f),
        Value::Int(i) => Ok(i as f64),
        _ => Err(JsError::new("Invalid result type")),
    }
}