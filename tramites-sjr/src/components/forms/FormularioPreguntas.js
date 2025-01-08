class FormularioPreguntas{
    constructor(container, questionId){
        this.container = container;
        this.questionId = questionId;
        this.homoclave = homoclave;
        this.paqueteId = paqueteId;
        this.endpointPreguntas = 'http://localhost/Api/public/obtener_preguntas';
        this.endpointRespuestas = 'http://localhost/Api/public/respuestas';
        this.init();
    }

    async init(){
        const preguntas = await this.obtenerPreguntas();
        if(preguntas){
            this.renderizarFormulario(preguntas);
        }else{
            console.log('No se puede cargar el elemento');
        }
    }

    async obtenerPreguntas(){
        try{
            const response = await fetch(`${this.endpointPreguntas}?homoclave=${this.homoclave}&paqueteId=${this.paqueteId}`);
            return await response.json();
        }catch(error){
            console.error('error al obtener el recurso');
            return null;
        }
    }

    renderizarFormulario(preguntas){
        this.container.innerHTML = ''; 
        const form = document.createElement('div');
        form.id = 'formulario-preguntas';

        preguntas.forEach(pregunta => {
            const preguntaDiv = document.createElement('div');
            preguntaDiv.classList.add('pregunta');

            preguntaDiv.innerHTML = `
                <label for=""></label>
            `
        });

    }
}