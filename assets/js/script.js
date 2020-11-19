$(document).ready(function () {

    //Loader inicial
    var contenedor = document.getElementById('contenedor_carga');

    //Oculta el contenedor
    function hideContainer(){
        contenedor.style.visibility = 'hidden';
        contenedor.style. opacity = '0';
    }

    //Muestra el contenedor
    function showContainer(){
        contenedor.style.visibility = 'visible';
        contenedor.style. opacity = '1';
    }
    
    // Primera llamada al cargar la página
    hideContainer();

    $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/1`,
        dataType: "json",
        success: function (response) {
            //Llamada a los 3 bloques de imagenes principales
            let infoPoke = response;
            $('#caja1').html(` 
                <img src=" https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${infoPoke.id}.png" alt="No ingresada aún" />
            `);

            $('#caja2').html(`
                <p>Front</p>
                <img src=" ${infoPoke.sprites.front_default} " alt=" No ingresada aún ">
                <p>Back</p>
                <img src=" ${infoPoke.sprites.back_default} " alt=" No ingresada aún ">
            `);

            $('#caja3').html(`
                <p>Front Shiny</p>
                <img src=" ${infoPoke.sprites.front_shiny} " alt=" No ingresada aún ">
                <p>Back Shiny</p>
                <img src=" ${infoPoke.sprites.back_shiny} " alt=" No ingresada aún">
            `);
            
            //Llamada de datos ficha pokemon
            $('#nombre').html(`<h4>Nombre: ${infoPoke.name}</h4>`);
            $('#numero').html(`<h5>N° Pokédex: ${infoPoke.id}</h5>`);
            $('#pesoaltura').html(`<h5>Peso: ${infoPoke.weight/10} kls. / Altura: ${infoPoke.height/10} mts.</h5>`);

            //Formula para buscar el Tipo
            $('#tipo').html("");
            infoPoke.types.forEach((tipo,index) => {
                $('#tipo').append(` ${tipo.type.name}`);
            });

            //Formula para cambiar el color de fondo dependiendo del Tipo
            let types = [];
            for (let i = 0; i < infoPoke.types.length; i++) {
                let type = infoPoke.types[i].type.name;
                types.push(type);
            };

            function pokemonType(types) {
                $("#tipo").html("");
                for (let i = 0; i < types.length; i++) {
                    $("#tipo").append("<div class='pokeType poke-info " + types[i] + "'>" + types[i] + " </div>");
                }
            };

            //Llamada a la funcion
            pokemonType(types);

            //Formula para mostrar habilidades 
            let skills = infoPoke.abilities;
            if (skills.length > 0) {
                skills.forEach((habilidades) => {
                    $('#nameSkills > ol').append(`<li>${habilidades.ability.name}</li>`)
                });
            } else {
                $('#nameSkills > ol').append(`NO TIENE HABILIDADES INGRESADAS AUN`)
            }

            //Formula para mostrar Held Items
            let heldItems = infoPoke.held_items;
            if (heldItems.length > 0) {
                heldItems.forEach((items) => {
                    $('#nameItems > ol').append(`<li>${items.item.name}</li>`)
                });
            } else {
                $('#nameItems > ol').append(`NO TIENE HELD ITEM`)
            }

            //Sprite animado sobre gráfico
            let foto = infoPoke.sprites.versions['generation-v']['black-white'].animated.front_default ? infoPoke.sprites.versions['generation-v']['black-white'].animated.front_default :  infoPoke.sprites.front_default;

            $('#gif').html(`<h3>Pokeinfo (de todas las ediciones):</h3>
                <img src="${foto}" alt="${infoPoke.id}">`)

                

            //Formula para conseguir la reseña  y otros datos       
            $.ajax({
                type: 'GET',
                url: `https://pokeapi.co/api/v2/pokemon-species/1`,
                dataType: 'json',
                success: function(response){
                    $('#info').append("");
                    response.flavor_text_entries.forEach(function (elemento) {  
                        if (elemento.language.name == "es") {
                            $('#info > ul').append(`
                            <li>${elemento.flavor_text}</li>`
                            );
                        }
                    });

                    let happy = response.base_happiness;
                    $('#happiness').html(`Puntos Base de Felicidad: ${happy}`)

                    let ratio = response.capture_rate;
                    $('#ratio').html(`El Ratio de Captura es del ${ratio/10}%`)
                },

            }); 

            //Stats para gráfico
            hp = infoPoke.stats[0].base_stat,
            atk = infoPoke.stats[1].base_stat,
            def = infoPoke.stats[2].base_stat,
            spAtk = infoPoke.stats[3].base_stat,
            spDef = infoPoke.stats[4].base_stat,
            speed = infoPoke.stats[5].base_stat,

            $(".hp").html(hp);
            $(".attack").html(atk);
            $(".defense").html(def);
            $(".special-attack").html(spAtk);
            $(".special-defense").html(spDef);
            $(".speed").html(speed);

            //Grafico CANVAS
            var grafico = {
                animationEnabled: true,
                animationDuration: 4000,
                title: {
                    text: `Stats Base de ${response.name.toUpperCase()}`,                
                    fontColor: "#cc1414"
                    
                },	
                axisY: {
                    tickThickness: 0,
                    lineThickness: 0,
                    valueFormatString: " ",
                    includeZero: true,
                    gridThickness: 0                    
                },
                axisX: {
                    tickThickness: 0,
                    lineThickness: 0,
                    labelFontSize: 18,
                    labelFontColor: "#cc1414"				
                },
                data: [{
                    indexLabelFontSize: 20,
                    toolTipContent: "<span style=\"color:#2c62aa\">{indexLabel}:</span> <span style=\"color:#cc1414\"><strong>{y}</strong></span>",
                    indexLabelPlacement: "inside",
                    indexLabelFontColor: "white",
                    indexLabelFontWeight: 600,
                    indexLabelFontFamily: "Montserrat",
                    color: "#2c62aa",
                    type: "bar",
                    dataPoints: [
                        { y: (speed), label: "Spd", indexLabel: `${infoPoke.stats[5].base_stat} pts.` },
                        { y: (spDef), label: "SpDef", indexLabel: `${infoPoke.stats[4].base_stat} pts.` },
                        { y: (spAtk), label: "SpAtk", indexLabel: `${infoPoke.stats[3].base_stat} pts.` },
                        { y: (def), label: "Def", indexLabel: `${infoPoke.stats[2].base_stat} pts.` },
                        { y: (atk), label: "Atk", indexLabel: `${infoPoke.stats[1].base_stat} pts.` },
                        { y: (hp), label: "HP", indexLabel: `${infoPoke.stats[0].base_stat} pts.` },
                    ]
                }]
            };

            //Llamado de gráfico
            $("#chartContainer").CanvasJSChart(grafico);

        }
    });

    // ------- BUSQUEDA NUEVA -------
    let buscarpokemon = (e) =>{ 

        e.preventDefault();
        let entrada = $('input').val().toLowerCase();
        if(entrada === '' || entrada === null){
            Swal.fire(
                '¿Qué pasó?',
                'Debes escribir algo para poder buscar',
                'question'
              )
        }else{
            $.ajax({

            // Acción ejecutada antes de iniciar el AJAX
            beforeSend: () => {
                showContainer();
            },
            
            // Acción ejecutada al finalizar el AJAX, tanto si falla como si funciona perfectamente
            complete: () => {
                hideContainer();
            },

                type: "GET",
                url: `https://pokeapi.co/api/v2/pokemon/${entrada}`,
                dataType: "json",
        
                success: function (response) {
                //Llamada a los 3 bloques de imagenes principales
                let infoPoke = response;
                $('#caja1').html(` 
                    <img src=" https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${infoPoke.id}.png" alt="No ingresada aún" />
                `);
        
                $('#caja2').html(`
                    <p>Front</p>
                    <img src=" ${infoPoke.sprites.front_default} " alt=" No ingresada aún ">
                    <p>Back</p>
                    <img src=" ${infoPoke.sprites.back_default} " alt=" No ingresada aún ">
                `);
        
                $('#caja3').html(`
                    <p>Front Shiny</p>
                    <img src=" ${infoPoke.sprites.front_shiny} " alt=" No ingresada aún ">
                    <p>Back Shiny</p>
                    <img src=" ${infoPoke.sprites.back_shiny} " alt=" No ingresada aún">
                `);
                    
                //Llamada de datos ficha pokemon
                $('#nombre').html(`<h4>Nombre: ${infoPoke.name}</h4>`);
                $('#numero').html(`<h5>N° Pokédex: ${infoPoke.id}</h5>`);
                $('#pesoaltura').html(`<h5>Peso: ${infoPoke.weight/10} kls. / Altura: ${infoPoke.height/10} mts.</h5>`);
        
                //Formula para buscar el Tipo
                $('#tipo').html("");
                    infoPoke.types.forEach((tipo,index) => {
                        $('#tipo').append(` ${tipo.type.name}`);
                });
        
                //Formula para cambiar el color de fondo dependiendo del Tipo
                let types = [];
                for (let i = 0; i < infoPoke.types.length; i++) {
                    let type = infoPoke.types[i].type.name;
                    types.push(type);
                };
        
                function pokemonType(types) {
                    $("#tipo").html("");
                    for (let i = 0; i < types.length; i++) {
                        $("#tipo").append("<div class='pokeType poke-info " + types[i] + "'>" + types[i] + " </div>");
                    }
                };
        
                //Llamada a la funcion
                pokemonType(types);
        
                //Formula para mostrar habilidades
                $("#nameSkills > ol").html(""); 
                let skills = infoPoke.abilities;
                if (skills.length > 0) {
                    skills.forEach((habilidades) => {
                        $('#nameSkills > ol').append(`<li>${habilidades.ability.name}</li>`)
                    });
                } else {
                    $('#nameSkills > ol').append(`NO TIENE HABILIDADES INGRESADAS AUN`)
                }
        
                //Formula para mostrar Held Items
                $("#nameItems > ol").html("");
                let heldItems = infoPoke.held_items;
                if (heldItems.length > 0) {
                    heldItems.forEach((items) => {
                        $('#nameItems > ol').append(`<li>${items.item.name}</li>`)
                    });
                } else {
                    $('#nameItems > ol').append(`NO TIENE HELD ITEM`)
                }
        
                //Sprite animado sobre gráfico
                let foto = infoPoke.sprites.versions['generation-v']['black-white'].animated.front_default ? infoPoke.sprites.versions['generation-v']['black-white'].animated.front_default :  infoPoke.sprites.front_default;
        
                $('#gif').html(`<h3>Pokeinfo (de todas las ediciones):</h3>
                    <img src="${foto}" alt="${infoPoke.id}">`)
        
                //Formula para conseguir la reseña y otros datos
                $.ajax({
                    type: 'GET',
                    url: `https://pokeapi.co/api/v2/pokemon-species/${entrada}`,
                    dataType: 'json',
                    success: function(response){
                        $('#info > ul').html("");
                        response.flavor_text_entries.forEach(function (elemento) {  
                            if (elemento.language.name == "es") {
                                $('#info > ul').append(`
                                <li>${elemento.flavor_text}</li>`
                                );
                            }
                        })
        
                        let happy = response.base_happiness;
                            $('#happiness').html(`Puntos Base de Felicidad: ${happy}`)
        
                        let ratio = response.capture_rate;
                            $('#ratio').html(`El Ratio de Captura es del ${ratio/10}%`)
                    },
                })
        
                //Stats para gráfico
                    hp = infoPoke.stats[0].base_stat,
                    atk = infoPoke.stats[1].base_stat,
                    def = infoPoke.stats[2].base_stat,
                    spAtk = infoPoke.stats[3].base_stat,
                    spDef = infoPoke.stats[4].base_stat,
                    speed = infoPoke.stats[5].base_stat,
        
                    $(".hp").html(hp);
                    $(".attack").html(atk);
                    $(".defense").html(def);
                    $(".special-attack").html(spAtk);
                    $(".special-defense").html(spDef);
                    $(".speed").html(speed);
        
                //Grafico CANVAS
                var grafico = {
                    animationEnabled: true,
                    animationDuration: 4000,
                    title: {
                        text: `Stats Base de ${response.name.toUpperCase()}`,                
                        fontColor: "#cc1414"        
                    },	
                    axisY: {
                        tickThickness: 0,
                        lineThickness: 0,
                        valueFormatString: " ",
                        includeZero: true,
                        gridThickness: 0                    
                    },
                    axisX: {
                        tickThickness: 0,
                        lineThickness: 0,
                        labelFontSize: 18,
                        labelFontColor: "#cc1414"				
                    },
                    data: [{
                        indexLabelFontSize: 20,
                        toolTipContent: "<span style=\"color:#2c62aa\">{indexLabel}:</span> <span style=\"color:#cc1414\"><strong>{y}</strong></span>",
                        indexLabelPlacement: "inside",
                        indexLabelFontColor: "white",
                        indexLabelFontWeight: 600,
                        indexLabelFontFamily: "Montserrat",
                        color: "#2c62aa",
                        type: "bar",
                        dataPoints: [
                            { y: (speed), label: "Spd", indexLabel: `${infoPoke.stats[5].base_stat} pts.` },
                            { y: (spDef), label: "SpDef", indexLabel: `${infoPoke.stats[4].base_stat} pts.` },
                            { y: (spAtk), label: "SpAtk", indexLabel: `${infoPoke.stats[3].base_stat} pts.` },
                            { y: (def), label: "Def", indexLabel: `${infoPoke.stats[2].base_stat} pts.` },
                            { y: (atk), label: "Atk", indexLabel: `${infoPoke.stats[1].base_stat} pts.` },
                            { y: (hp), label: "HP", indexLabel: `${infoPoke.stats[0].base_stat} pts.` },
                        ]
                    }]
                };
        
                //Llamado de gráfico
                $("#chartContainer").CanvasJSChart(grafico);
        
                //Comando para borrar lo escrito en el buscador
                $('input').val("");
            },
        
            //Respuesta en caso de error en la busqueda
            error: function(error){
                console.error(error);
                $('#imagen').html(`
                <p>El Nombre o Número: "${entrada}" no existe, intenta nuevamente</p>`);
                    Swal.fire({
                        icon: 'error',
                        title: '¡El nombre o número no existe!',
                        text: '(Puede que este incompleto o aun no ingresado)',
                        footer: 'Intentalo nuevamente'
                    });
                },
            });
        }
}
    //Pa' que funcione la tecla Enter
    $('form').on('submit', buscarpokemon);
});