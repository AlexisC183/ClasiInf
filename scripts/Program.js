$(document).ready(function() {
    var mouseenterEnMaterias = null;
    var mouseleaveEnMaterias = null;
    var mouseenterEnRotulos = null;
    var mouseleaveEnRotulos = null;

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $("a").on("mouseenter", function() {
            $(this).css("text-decoration", "underline");
        }).on("mouseleave", function() {
            $(this).css("text-decoration", "none");
        });

        $("input[type='button']").on("mouseenter", function() {
            $(this).css({
                "background" : "black",
                "border-color" : "white",
                "color" : "white"
            });
        }).on("mouseleave", function() {
            $(this).css({
                "background" : "white",
                "border-color" : "black",
                "color" : "black"
            });
        });

        //Handler mouseenter en materias
        mouseenterEnMaterias = function() {
            $(this).css("filter", "brightness(90%)");
        }

        //Handler mouseleave en materias
        mouseleaveEnMaterias = function() {
            $(this).css("filter", "brightness(100%)");
        }

        //Handler mouseenter en rótulos
        mouseenterEnRotulos = function() {
            $(this).css({
                "background" : "rgba(0, 0, 0, 0.1)",
                "cursor" : "default"
            });
        }

        //Handler mouseleave en rótulos
        mouseleaveEnRotulos = function() {
            $(this).css("background", "rgba(0, 0, 0, 0)");
        }
    }

    //Evento redimensionar ventana
    $(window).on("resize", function(){
        const visibleWindowWidth = $("body").width();
        const visibleWindowHeight = $(window.top).height();

        if (visibleWindowWidth <= 640) {
            $("body").css("flex-direction", "column");
            $(".division").width(visibleWindowWidth - 20);
            $(".division").height(visibleWindowHeight / 2 - 20);
        }
        else{
            $("body").css("flex-direction", "row");
            $(".division").width(visibleWindowWidth / 2);
            $(".division").height(visibleWindowHeight - 20);
        }

        $("#cuadroDeDialogo").width(visibleWindowWidth);
        $("#cuadroDeDialogo").height(visibleWindowHeight);  
    });

    $(window).trigger("resize");

    const nodeListDeNiveles = document.querySelectorAll("#niveles > div");
    const niveles = [ nodeListDeNiveles[0], nodeListDeNiveles[1], nodeListDeNiveles[2] ];
    const cadenasRotulos = [ $(niveles[0]).find("div:first-child p").text(), $(niveles[1]).find("div:first-child p").text(), $(niveles[2]).find("div:first-child p").text() ];

    for (var i = 0; i < cadenasRotulos.length; i++) {
        $("#cuadroDeDialogo select").append("<option>" + cadenasRotulos[i] + "</option>");
    }

    const nodeListDeOpcionesDeListbox = document.querySelectorAll("option");
    const opcionesDeListbox = [ nodeListDeOpcionesDeListbox[0], nodeListDeOpcionesDeListbox[1], nodeListDeOpcionesDeListbox[2] ];

    //Evento change en listbox
    $("#cuadroDeDialogo select").on("change", function() {
        $("input[value='Aceptar']").show();
    });

    const cantidadesDeMaterias = [ 0, 0, 0 ];

    function CerrarCuadroDeDialogo() {
        $("#cuadroDeDialogo").css("display", "none");
        $("select").hide();
        $("input[type='text']").hide();
        $("#cuadroDeDialogo input[type='button']").off("click");
    }
    
    //Evento mouseenter-mouseleave en materias
    $(".contenedorMaterias img").on("mouseenter", mouseenterEnMaterias).on("mouseleave", mouseleaveEnMaterias);

    //Evento click en materias
    $(".contenedorMaterias img").on("click", function() {
        const materia = $(this);

        $("#cuadroDeDialogo").css("display", "flex");
        
        $("#cuadroDeDialogo p").text("Seleccionar nivel dónde colocar la materia");
        $("select").show().focus();
        
        //Botón Aceptar
        $("input[value='Aceptar']").on("click", function() {
            var i = 0;

            while ($("#cuadroDeDialogo select option:selected").text() != cadenasRotulos[i]) {
                i++;
            }

            const nivel = niveles[i];

            if (cantidadesDeMaterias[i] % 9 == 0 && cantidadesDeMaterias[i] != 0) {
                $(nivel).find("div").css("height", parseInt($(nivel).find("div").css("height")) + 100 + "px");
                $(nivel).find("div:last-child p").append("<br>");
            }
            else if (cantidadesDeMaterias[i] < 10 && cantidadesDeMaterias[i] + 1 > Math.max(...cantidadesDeMaterias)) {
                $("#niveles").width($("#niveles").width() + 162);
            }

            $(nivel).find("div:last-child p").append("<img src='" + materia.attr("src") + "'>");
            cantidadesDeMaterias[i]++;

            //Evento mouseenter-mouseleave en materias seleccionadas
            $(nivel).find("div:last-child p img:last-child").on("mouseenter", mouseenterEnMaterias).on("mouseleave", mouseleaveEnMaterias);
            
            //Evento click en materias seleccionadas
            $(nivel).find("div:last-child p img:last-child").on("click", function() {
                $(this).nextAll("br").each(function() {
                    $(this).insertAfter($(this).next());
                });
                    
                $("img[src='" + $(this).attr("src") + "']").show();
                $(this).remove();

                const cantidadDeMateriasMayor = Math.max(...cantidadesDeMaterias);
                const indiceNivel = niveles.indexOf(nivel);

                cantidadesDeMaterias[indiceNivel]--;

                if (cantidadesDeMaterias[indiceNivel] != 0 && cantidadesDeMaterias[indiceNivel] % 9 == 0) {
                    $(nivel).find("div").css("height", parseInt($(nivel).find("div").css("height")) - 100 + "px");
                    $(nivel).find("div:last-child p br:last-of-type").remove();
                }
                else if (!cantidadesDeMaterias.includes(cantidadDeMateriasMayor) && cantidadesDeMaterias[indiceNivel] < 9) {
                    $("#niveles").width($("#niveles").width() - 162);
                }
            });

            $(materia).hide();

            CerrarCuadroDeDialogo();
        });

        //Botón Cancelar
        $("input[value='Cancelar']").on("click", function() {
            CerrarCuadroDeDialogo();
        });
    });

    //Handler click en rótulos
    function clickEnRotulos() {
        const parrafoRotulo = $(this).find("p");

        $("#cuadroDeDialogo").css("display", "flex");
        const isAceptarOculto = $("input[value='Aceptar']").is(":hidden");

        $("#cuadroDeDialogo p").text("Introducir el nuevo nombre del nivel");
        $("input[type='text']").val("").show().focus();
        if (isAceptarOculto) {
            $("input[value='Aceptar']").show();
        }

        //Botón Aceptar
        $("input[value='Aceptar']").on("click", function() {
            var nuevoNombre = $("input[type='text']").val();
            
            if (nuevoNombre != $(parrafoRotulo).text()) {
                var i = 0;

                while (cadenasRotulos.includes(nuevoNombre + ((i == 0) ? "" : i))) {
                    i++;
                }
    
                if (i > 0) {
                    nuevoNombre += i;
                    i = 0;
                }
                cadenasRotulos[cadenasRotulos.indexOf($(parrafoRotulo).text())] = nuevoNombre;
                while ($(parrafoRotulo).text() != $(opcionesDeListbox[i]).text()) {
                    i++;
                }
                $(opcionesDeListbox[i]).text(nuevoNombre);
                $(parrafoRotulo).text(nuevoNombre);
            }

            if (isAceptarOculto) {
                $("input[value='Aceptar']").hide();
            }
            CerrarCuadroDeDialogo();
        });

        //Botón Cancelar
        $("input[value='Cancelar']").on("click", function() {
            if (isAceptarOculto) {
                $("input[value='Aceptar']").hide();
            }
            CerrarCuadroDeDialogo();
        });
    }

    //Evento mouseenter-mouseleave en rótulos
    $("#niveles div div:first-child").on("mouseenter", mouseenterEnRotulos).on("mouseleave", mouseleaveEnRotulos);

    //Evento click en rótulos
    $("#niveles div div:first-child").on("click", clickEnRotulos);

    //Evento click en Añadir nuevo nivel
    $("input[value='Añadir nuevo nivel']").on("click", function() {
        var asciiCode = 65;

        while (cadenasRotulos.includes(String.fromCharCode(asciiCode))) {
            asciiCode++;
        }

        $("#niveles").append(`
            <div>
                <div>
                    <p>${String.fromCharCode(asciiCode)}</p>
                </div>
                <div class="contenedorMaterias">
                    <p>

                    </p>
                </div>
            </div>
        `);

        //Evento mouseenter-mouseleave en rótulos
        $("#niveles div:last-child div:first-child").on("mouseenter", mouseenterEnRotulos).on("mouseleave", mouseleaveEnRotulos);

        //Evento click en rótulos
        $("#niveles div:last-child div:first-child").on("click", clickEnRotulos);

        niveles.push(document.querySelector("#niveles > div:last-child"));
        cantidadesDeMaterias.push(0);
        cadenasRotulos.push(String.fromCharCode(asciiCode));
        $("#cuadroDeDialogo select").append("<option>" + cadenasRotulos[niveles.length - 1] + "</option>");
        opcionesDeListbox.push(document.querySelector("#cuadroDeDialogo select option:last-child"));

        $("input[value='Retirar nivel']").show();
        if (niveles.length == 26) {
            $(this).hide();
        }
    });

    //Evento click en Retirar nivel
    $("input[value='Retirar nivel']").on("click", function() {
        $("#cuadroDeDialogo").css("display", "flex");
        
        $("#cuadroDeDialogo p").text("Seleccionar nivel a retirar");
        $("select").show().focus();
        
        //Botón Aceptar
        $("input[value='Aceptar']").on("click", function() {
            const indiceNivel = cadenasRotulos.indexOf($("#cuadroDeDialogo select option:selected").text());
        
            $(niveles[indiceNivel]).find("div:last-child img").each(function() {
                $("img[src='" + $(this).attr("src") + "']").show();
            });
            $(niveles[indiceNivel]).remove();

            niveles.splice(indiceNivel, 1);

            const cantidadDeMaterias = cantidadesDeMaterias[indiceNivel];
            cantidadesDeMaterias.splice(indiceNivel, 1);
            const nuevoMayor = Math.max(...cantidadesDeMaterias);
            if (nuevoMayor < 8 && cantidadDeMaterias - nuevoMayor > 0) {
                $("#niveles").width($("#niveles").width() - (((cantidadDeMaterias > 8) ? 8 : cantidadDeMaterias) - nuevoMayor) * 162);
            }

            cadenasRotulos.splice(indiceNivel, 1);
            $(opcionesDeListbox[indiceNivel]).remove();
            opcionesDeListbox.splice(indiceNivel, 1);

            $("input[value='Aceptar']").hide();
            $("input[value='Añadir nuevo nivel']").show();
            if (niveles.length == 1) {
                $("input[value='Retirar nivel']").hide();
            }
            CerrarCuadroDeDialogo();
        });

        //Botón Cancelar
        $("input[value='Cancelar']").on("click", function() {
            CerrarCuadroDeDialogo();
        });
    });

    //Evento click en Guardar al dispositivo
    $("input[value='Guardar al dispositivo']").on("click", function() {
        html2canvas(document.getElementById("niveles")).then(function(canvas) {
            const anchorTag = document.createElement("a");
            document.body.appendChild(anchorTag);
            anchorTag.download = "clasiInf.png";
            anchorTag.href = canvas.toDataURL();
            anchorTag.target = "_blank";
            anchorTag.click();
        });
    });
});