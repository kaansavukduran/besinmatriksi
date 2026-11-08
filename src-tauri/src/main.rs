// Windows sürümünde ek konsol penceresi açılmasın
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    besin_matriksi_lib::run()
}
