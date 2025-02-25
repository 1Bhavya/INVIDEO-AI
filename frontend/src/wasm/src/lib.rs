use wasm_bindgen::prelude::*;
use evalexpr::*;

#[wasm_bindgen]
pub fn calculate_int_big(input: &str) -> Result<JsValue, JsError> {
    let result = eval(input)?;

    match result {
        Value::Int(i) => Ok(JsValue::from_str(&i.to_string())), // JavaScript will treat it as BigInt
        _ => Err(JsError::new("Result is not an integer")),
    }
}

