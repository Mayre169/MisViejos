import React from 'react';
import Header from './components/Header';

// Asegúrate de que Font Awesome esté cargado en tu index.html o equivalente:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0V4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

export default function AboutUsPage() {
    return (
        <>
        <Header />
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
            <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
                {/* Encabezado Principal */}
                <div className="bg-gray-900 text-white p-8 sm:p-10 lg:p-12 text-center rounded-t-lg">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-down">
                        Sobre Nosotros - Bodega Mis Viejos
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl font-light opacity-90 animate-fade-in">
                        Más de 5 años cultivando la pasión y la tradición en cada botella.
                    </p>
                </div>

                {/* Contenido Principal */}
                <div className="p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Sección de Historia y Valores */}
                    <div className="space-y-8">
                        <section className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                                <i className="fas fa-history text-indigo-600 mr-3"></i> Nuestra Historia
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Desde hace más de cinco años, "Bodega Mis Viejos" ha sido un sueño hecho realidad, nacido de la pasión por el buen vino y el respeto por la tierra. Lo que comenzó como una pequeña iniciativa familiar, ha crecido hasta convertirse en un referente de calidad y tradición. Cada cosecha es un tributo a la dedicación y al legado de generaciones, combinando técnicas ancestrales con innovaciones modernas para ofrecer vinos excepcionales.
                            </p>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                                <i className="fas fa-handshake text-indigo-600 mr-3"></i> Nuestros Valores
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                                <li>
                                    <span className="font-semibold text-indigo-700">Transparencia:</span> Creemos en un proceso abierto y honesto, desde la vid hasta tu copa. Queremos que conozcas cada detalle de cómo elaboramos nuestros vinos.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-700">Responsabilidad:</span> Nuestro compromiso es con el medio ambiente y con nuestras comunidades. Practicamos una viticultura sostenible y ética, cuidando cada recurso.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-700">Calidad:</span> La excelencia es nuestra meta. Seleccionamos las mejores uvas y aplicamos los más altos estándares en cada etapa de la producción.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-700">Pasión:</span> El amor por el vino es el motor que impulsa cada decisión, desde el cultivo hasta el embotellado, garantizando un producto hecho con el corazón.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-700">Tradición:</span> Honramos las técnicas y el conocimiento transmitido por nuestros antepasados, fusionándolos con la innovación para crear vinos únicos.
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Sección de Misión, Visión y Equipo */}
                    <div className="space-y-8">
                        <section className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                                <i className="fas fa-lightbulb text-indigo-600 mr-3"></i> Misión y Visión
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <span className="font-semibold text-indigo-700">Nuestra Misión:</span> Elaborar vinos de alta calidad que reflejen la riqueza de nuestra tierra y la dedicación de nuestro equipo, ofreciendo una experiencia inigualable a nuestros clientes.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <span className="font-semibold text-indigo-700">Nuestra Visión:</span> Ser reconocidos como una bodega líder en la producción de vinos sostenibles y auténticos, expandiendo nuestra pasión a nuevos mercados y manteniendo siempre la esencia familiar.
                            </p>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-3xl font-bold text-indigo-800 mb-4 flex items-center">
                                <i className="fas fa-users text-indigo-600 mr-3"></i> Nuestro Equipo
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Detrás de cada botella de "Mis Viejos" hay un equipo de expertos viticultores, enólogos y apasionados del vino, trabajando en armonía. Combinamos la sabiduría tradicional con la innovación para asegurar que cada vino sea una obra de arte. Nos enorgullece nuestro compromiso con la calidad y la excelencia, y esperamos compartir nuestra pasión contigo.
                            </p>
                            {/* Placeholder para imagen del equipo o viñedo */}
                            <div className="mt-6">
                                <img
                                    src="https://placehold.co/600x300/E0E7FF/4338CA?text=Viñedo+Mis+Viejos"
                                    alt="Viñedo Mis Viejos"
                                    className="w-full h-auto rounded-lg shadow-md object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x300?text=Imagen+no+disponible"; }}
                                />
                                <p className="text-center text-gray-500 text-sm mt-2">
                                    [Image of Viñedo Mis Viejos]
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Pie de página (opcional, para coherencia con otras páginas) */}
                <div className="bg-gray-900 text-white p-6 text-center rounded-b-lg mt-8">
                    <p className="text-md">
                        Gracias por ser parte de la familia "Mis Viejos". ¡Salud!
                    </p>
                </div>
            </div>
        </div>
        </>
    );
}
