export const PASOS = [
  {
    id: 1,
    titulo: "Aplicar encuestas RPS y ATS",
    actividades: [
      {
        id: "1-1",
        texto: "Aplicar encuesta de Riesgos Psicosociales (RPS) a todo el personal",
        link: "https://www.evaluaycrece.com",
        linkLabel: "Abrir plataforma de encuestas",
      },
      {
        id: "1-2",
        texto: "Aplicar encuesta de ATS a todo el personal",
        link: "https://www.evaluaycrece.com",
        linkLabel: "Abrir plataforma de encuestas",
      },
      {
        id: "1-3",
        texto: "Generar el reporte de encuestas con los elementos requeridos por NOM-035 y las recomendaciones del consultor.",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/portada-enc.pdf",
        linkLabel: "Abrir portada-enc.pdf",
      },
      {
        id: "1-4",
        texto: "Integrar los resultados al diagnóstico de seguridad y salud en el trabajo. Incluye el resultado global.",
        nota: "Se recomienda hacer una carta dirigida al responsable de la comisión de seguridad e higiene entregando el resultado de las encuestas y con firma de recibido.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Validar las respuestas de las encuestas",
    actividades: [
      {
        id: "2-1",
        texto: "Verificar validez de respuestas ATS mediante el formato de verificación",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/Formato+para+verificar+informaci%C3%B3n+ATS.pdf",
        linkLabel: "Abrir formato de verificación ATS",
      },
      {
        id: "2-2",
        texto: "Canalizar los casos de ATS que lo requieran",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/Formato+de+Canalizaci%C3%B3n.pdf",
        linkLabel: "Abrir formato de canalización",
      },
      {
        id: "2-3",
        texto: "Validar respuestas RPS: confirmar casos de riesgo alto con síntomas",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/Formato_Entrevista_Riesgos_Psicosociales.docx",
        linkLabel: "Descargar formato de entrevista RPS",
      },
    ],
  },
  {
    id: 3,
    titulo: "Llenar el formato de acciones correctivas",
    actividades: [
      {
        id: "3-1",
        texto: "Completar el formato de acciones correctivas por áreas de trabajo",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/Formato_Programa_Intervencion_NOM035.xlsx",
        linkLabel: "Descargar formato de acciones correctivas",
      },
      {
        id: "3-2",
        texto: "Completar el formato de acciones correctivas por trabajadores",
      },
      {
        id: "3-3",
        texto: "Asignar responsable y fecha programada a cada acción de control",
      },
    ],
  },
  {
    id: 4,
    titulo: "Implementación de programas preventivos",
    actividades: [
      // 8.2a — Liderazgo y relaciones
      { id: "4-a-1", seccion: "a", seccionTitulo: "8.2 a. Con relación al liderazgo y relaciones en el trabajo se cuenta con:", seccionLink: "https://ui-nom035.s3.us-east-2.amazonaws.com/Minuta_Reunion_Semanal.pdf", seccionLinkLabel: "Formato de reuniones semanales (cumple puntos 1, 3 y 4)", texto: "1. Acciones para manejar los conflictos en el trabajo, distribuir los tiempos de trabajo y determinar las prioridades en el trabajo", nota: "Se podría encontrar en el Reglamento Interior de Trabajo y/o en un Manual de Operaciones" },
      { id: "4-a-1d", seccion: "a", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-a-2", seccion: "a", texto: "2. Lineamientos para prohibir la discriminación, fomentar la equidad y el respeto", nota: "Por ejemplo, un código de ética, una lista de valores, un protocolo para evitar la violencia laboral" },
      { id: "4-a-2d", seccion: "a", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-a-3", seccion: "a", texto: "3. Mecanismos para fomentar la comunicación entre supervisores o gerentes y trabajadores, así como entre los trabajadores", nota: "Por ejemplo, contar con grupos de WhatsApp y un buzón de sugerencias" },
      { id: "4-a-3d", seccion: "a", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-a-4", seccion: "a", texto: "4. Instrucciones claras para atender problemas que afectan el trabajo", nota: "Se puede encontrar en el Reglamento Interior de Trabajo y/o en un manual de operaciones" },
      { id: "4-a-4d", seccion: "a", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-a-5", seccion: "a", texto: "5. Capacitación y sensibilización de los directivos, gerentes y supervisores para la prevención de los factores de RPS y la promoción de EO favorables, con énfasis en lo señalado en los puntos 1) al 3) arriba mencionados", nota: "Por ejemplo, un curso de capacitación en la NOM 035 STPS 2018 para todos los que tienen gente a su cargo" },
      { id: "4-a-5d", seccion: "a", texto: "Desarrollar:", tipo: "nota" },

      // 8.2b — Cargas de trabajo
      { id: "4-b-1", seccion: "b", seccionTitulo: "8.2 b. Respecto a las cargas de trabajo se contempla:", seccionAyuda: "Operativas: Descripción de puestos, Reglamento Interior de Trabajo (RIT), Bitácora de turno / registro de asignación diaria firmado por supervisor. Administrativas: Descripción de puestos, RIT.", texto: "1. Revisión y supervisión de que la distribución de la carga de trabajo se realiza de forma equitativa y considerando el número de trabajadores y su capacitación" },
      { id: "4-b-1d", seccion: "b", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-b-2", seccion: "b", texto: "2. Actividades para planificar el trabajo, considerando el proceso productivo, de manera que se tengan pausas o periodos de descanso, rotación de tareas y otras medidas, a efecto de evitar ritmos de trabajo acelerados" },
      { id: "4-b-2d", seccion: "b", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-b-3", seccion: "b", texto: "3. Instructivos o procedimientos que definan claramente las tareas y responsabilidades", nota: "Por ejemplo, descripciones de puesto que incluyan estos elementos" },
      { id: "4-b-3d", seccion: "b", texto: "Desarrollar:", tipo: "nota" },

      // 8.2c — Control de trabajo
      { id: "4-c-1", seccion: "c", seccionTitulo: "8.2 c. En lo que se refiere al control de trabajo comprende:", seccionAyuda: "Una sola práctica puede cubrir los tres puntos: Buzón de propuestas + Una reunión periódica donde se revisan las propuestas.", seccionLink: "https://ui-nom035.s3.us-east-2.amazonaws.com/Propuestas_Mejora.pdf", seccionLinkLabel: "Formato de propuestas", texto: "1. Actividades para involucrar a los trabajadores en la toma de decisiones sobre la organización de su trabajo, para que participen en la mejora de las condiciones de trabajo y la productividad siempre que el proceso productivo lo permita y cuenten con la experiencia y capacitación para ello", nota: "Por ejemplo, reuniones de los trabajadores con el gerente o supervisor de producción" },
      { id: "4-c-1d", seccion: "c", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-c-2", seccion: "c", texto: "2. Acciones para acordar y mejorar el margen de libertad y control sobre su trabajo por parte de los trabajadores y el patrón, y para impulsar que éstos desarrollen nuevas competencias o habilidades, considerando las limitaciones del proceso productivo", nota: "Por ejemplo, un programa de capacitación" },
      { id: "4-c-2d", seccion: "c", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-c-3", seccion: "c", texto: "3. Reuniones para abordar las áreas de oportunidad de mejora, a efecto de atender los problemas en el lugar de su trabajo y determinar sus soluciones", nota: "Por ejemplo, reuniones de los trabajadores con el gerente o supervisor de producción" },
      { id: "4-c-3d", seccion: "c", texto: "Desarrollar:", tipo: "nota" },

      // 8.2d — Apoyo social
      { id: "4-d-1", seccion: "d", seccionTitulo: "8.2 d. En lo relativo al apoyo social incluye actividades que permiten:", seccionAyuda: "Una sola práctica: Junta mensual de equipo para promover acciones de cuidado y construcción de paz.", seccionLink: "https://decupaz.s3.us-east-2.amazonaws.com/acta-paz.docx", seccionLinkLabel: "Acta constitutiva", texto: "1. Mejorar las relaciones entre trabajadores, supervisores, gerentes y patrones para que puedan obtener apoyo los unos de los otros", nota: "Por ejemplo, actividades de integración o eventos especiales como el día de la madre, 12 de diciembre, etc." },
      { id: "4-d-1d", seccion: "d", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-d-2", seccion: "d", texto: "2. Realizar reuniones periódicas (semestrales o anuales) de seguimiento a las actividades establecidas para el apoyo social y, en su caso, extraordinarias si ocurren eventos que pongan en riesgo la salud del trabajador o al centro de trabajo", nota: "Por ejemplo, reuniones de planeación, seguimiento y/o evaluación de los eventos de integración o eventos especiales" },
      { id: "4-d-2d", seccion: "d", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-d-3", seccion: "d", texto: "3. Promover la ayuda mutua y el intercambio de conocimientos y experiencias entre los trabajadores", nota: "Por ejemplo, cursos de capacitación proporcionados por los mismos trabajadores" },
      { id: "4-d-3d", seccion: "d", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-d-4", seccion: "d", texto: "4. Fomentar actividades culturales y deportivas entre sus trabajadores y proporcionarles los equipos y útiles indispensables" },
      { id: "4-d-4d", seccion: "d", texto: "Desarrollar:", tipo: "nota" },

      // 8.2e — Relación trabajo-familia
      { id: "4-e-1", seccion: "e", seccionTitulo: "8.2 e. En lo relativo a la relación trabajo - familia:", texto: "1. Acciones para involucrar a los trabajadores en la definición de los horarios de trabajo, cuando las condiciones del trabajo lo permitan", nota: "En caso de que no se autorice, deberá registrarse lo señalado por la empresa, así como el nombre de la persona que lo indicó" },
      { id: "4-e-1d", seccion: "e", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-e-2", seccion: "e", texto: "2. Lineamientos para establecer medidas y límites que eviten las jornadas de trabajo superiores a las previstas en la Ley Federal del Trabajo", nota: "La evidencia legal y por lo tanto la ideal es el Reglamento Interior de Trabajo. Especificar el párrafo donde se encuentra la jornada de trabajo" },
      { id: "4-e-2d", seccion: "e", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-e-3", seccion: "e", texto: "3. Apoyos a los trabajadores, de manera que puedan atender emergencias familiares, mismas que el trabajador tendrá que comprobar" },
      { id: "4-e-3d", seccion: "e", texto: "Desarrollar:", tipo: "nota" },
      { id: "4-e-4", seccion: "e", texto: "4. Promoción de actividades de integración familiar en el trabajo, previo acuerdo con los trabajadores" },
      { id: "4-e-4d", seccion: "e", texto: "Desarrollar:", tipo: "nota" },

      // 8.2f — Reconocimiento en el trabajo
      { id: "4-f-1", seccion: "f", seccionTitulo: "8.2 f. En lo relativo al reconocimiento en el trabajo:", texto: "1. El reconocimiento del desempeño sobresaliente (superior al esperado) de los trabajadores" },
      { id: "4-f-2", seccion: "f", texto: "2. La difusión de los logros de los trabajadores sobresalientes" },
      { id: "4-f-3", seccion: "f", texto: "3. En su caso, expresar al trabajador sus posibilidades de desarrollo" },
      { id: "4-f-3d", seccion: "f", texto: "Desarrollar:", tipo: "nota" },

      // 8.2g — Violencia laboral
      { id: "4-g-1", seccion: "g", seccionTitulo: "8.2 g. En relación con la violencia laboral:", seccionLink: "https://dist-naranja.s3.us-east-2.amazonaws.com/Protocolo_VL_Empresa.pdf", seccionLinkLabel: "Protocolo de violencia laboral", texto: "1. Difunde información para sensibilizar sobre la violencia laboral, tanto a trabajadores como a directivos, gerentes y supervisores" },
      { id: "4-g-2", seccion: "g", texto: "2. Establece procedimientos de actuación y seguimiento para tratar problemas relacionados con la violencia laboral, y capacitar al responsable de su implementación" },
      { id: "4-g-3", seccion: "g", texto: "3. Informa sobre la forma en que se tendrán que denunciar actos de violencia laboral" },

      // 8.2h — Información y comunicación
      { id: "4-h-1", seccion: "h", seccionTitulo: "8.2 h. En relación con la información y comunicación que se proporciona a los trabajadores:", texto: "1. Comunicación directa y con frecuencia entre el patrón, supervisor o jefe inmediato y los trabajadores sobre cualquier problema que impida o retrase el desarrollo del trabajo" },
      { id: "4-h-2", seccion: "h", texto: "2. Difusión entre los trabajadores de los cambios en la organización o condiciones de trabajo" },
      { id: "4-h-3", seccion: "h", texto: "3. Oportunidad de que los trabajadores puedan expresar sus opiniones sobre la solución de los problemas o las mejoras de las condiciones de su trabajo para mejorar su desempeño" },
      { id: "4-h-3d", seccion: "h", texto: "Desarrollar:", tipo: "nota" },

      // 8.2i — Capacitación y adiestramiento
      { id: "4-i-1", seccion: "i", seccionTitulo: "8.2 i. Respecto a la capacitación y adiestramiento que se proporciona a los trabajadores:", seccionLink: "https://ui-nom035.s3.us-east-2.amazonaws.com/formato_capacitacion.docx", seccionLinkLabel: "Formato de capacitación", texto: "1. Analiza la relación capacitación-tareas encomendadas" },
      { id: "4-i-2", seccion: "i", texto: "2. Da oportunidad a los trabajadores para señalar sus necesidades de capacitación conforme a sus actividades" },
      { id: "4-i-3", seccion: "i", texto: "3. Realiza una detección de necesidades de capacitación al menos cada 2 años e integrar su resultado en el programa de capacitación" },
      { id: "4-i-3d", seccion: "i", texto: "Desarrollar:", tipo: "nota" },

      // 8.1b — Mecanismos para quejas
      { id: "4-j-1", seccion: "j", seccionTitulo: "8.1 b. Mecanismos seguros y confidenciales para quejas y denuncias:", texto: "¿Dispone de mecanismos seguros y confidenciales para la recepción de quejas por prácticas opuestas al entorno organizacional favorable y para denunciar actos de violencia laboral?" },
    ],
  },
  {
    id: 5,
    titulo: "Difusión",
    actividades: [
      {
        id: "5-1",
        texto: "Difundir la política de riesgos psicosociales en lugar visible",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/poster-3.pdf",
        linkLabel: "Descargar póster de política RPS",
      },
      {
        id: "5-2",
        texto: "Difundir riesgos a la salud por exposición a RPS",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/poster1.pdf",
        linkLabel: "Descargar póster de riesgos a la salud",
      },
      {
        id: "5-3",
        texto: "Publicar los resultados generales de las encuestas",
        link: "https://ui-nom035.s3.us-east-2.amazonaws.com/poster-resultadorps.pdf",
        linkLabel: "Descargar póster de resultados RPS",
      },
      {
        id: "5-4",
        texto: "Difundir el código de ética con mecanismo para quejas y violencia laboral",
      },
      {
        id: "5-5",
        texto: "Publicar resumen de acciones preventivas y plan correctivo",
      },
      {
        id: "5-6",
        texto: "Publicar el procedimiento para presentar quejas",
      },
    ],
  },
  {
    id: 6,
    titulo: "Instalar buzón de quejas y sugerencias",
    actividades: [
      {
        id: "6-1",
        texto: "Instalar buzón físico y/o electrónico de quejas y sugerencias",
      },
      {
        id: "6-2",
        texto: "Publicar el procedimiento para utilizar el buzón",
      },
    ],
  },
  {
    id: 7,
    titulo: "Integrar carpeta de evidencias y solicitar dictamen",
    actividades: [
      {
        id: "7-1",
        texto: "Integrar resultados de encuestas ATS y/o RPS en la carpeta",
      },
      {
        id: "7-2",
        texto: "Incluir el formato de acciones correctivas en la carpeta",
      },
      {
        id: "7-3",
        texto: "Incluir lista de trabajadores con exámenes o evaluaciones clínicas",
      },
      {
        id: "7-4",
        texto: "Solicitar dictamen a Unidad de Inspección acreditada por EMA y aprobada por STPS",
        link: "https://consentidohumano.com/nom035",
        linkLabel: "Solicitar dictamen con CRESE",
      },
    ],
  },
];
