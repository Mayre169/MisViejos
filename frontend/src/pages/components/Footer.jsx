export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="footer py-8 px-4 md:px-8 lg:px-12 text-sm text-center md:text-left">
                <div className="footer-content max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>&copy; 2024 Tienda Mis Viejos. Todos los derechos reservados.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                        <a href="#" className="hover:underline">Política de Privacidad</a>
                        <a href="#" className="hover:underline">Términos de Servicio</a>
                        <a href="#" className="hover:underline">Preguntas Frecuentes</a>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" aria-label="Facebook" className="text-xl hover:opacity-100"><i className="fa-brands fa-facebook"></i></a>
                        <a href="#" aria-label="Twitter" className="text-xl hover:opacity-100"><i className="fa-brands fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram" className="text-xl hover:opacity-100"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                </div>
            </footer>
        </>
    )
}