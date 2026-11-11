#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Yalnız kullanıcının tıkladığı sürüm sayfası bağlantısını sistem tarayıcısında açmak için
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("Besin Matriksi başlatılamadı");
}
