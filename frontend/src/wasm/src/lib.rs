use wasm_bindgen::prelude::*;
use meval::eval_str;

#[wasm_bindgen]
pub fn evaluate_expression(expression: &str) -> String {
    match eval_str(expression) {
        Ok(result) => result.to_string(),
        Err(_) => "Invalid expression".to_string(),
    }
}
