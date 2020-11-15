function proceso(caso) {
	console.log("----------------------------------");
	var mensaje;
	var mensaje2;
	var cont=0;
	var numAl1;
	var numAl2;
	var canal=0;
	var contTrama;
	var cont;
	var imprimirMSJ="";
	var contMSJ1=0;
	var colision;
	var conGeneral=0;

	var numsAl1;
	var numsAl2;
	if (caso==0) {
		numsAl1=Math.floor(Math.random()*(5-1)+1);
		numsAl2=Math.floor(Math.random()*(5-1)+1);
	}else if (caso==1) {
		numsAl1=Math.floor(Math.random()*(5-1)+1);
		numsAl2=numsAl1;
	}

	function validar() {
		exp=document.getElementById('msj1').value;
		exp2=document.getElementById('msj2').value;
		if (exp.length==0 || exp.length>100 || exp2.length==0 || exp2.length>100) {
			alert("Los mensajes están delimitados de 1 a 100 caracteres ");
		}else{
			prepararEnvio(0);
		}
	}
	validar();

	function prepararEnvio(conta,msj) {
		if (conta==0) {
			
			numAl1=(1000*numsAl1);//Math.random()*(2000-1000)+1000);
			numAl2=(1000*numsAl2);//Math.random()*(2000-1000)+1000);

			console.log("Tiempo en el que se manda el primer mensaje "+numAl1+" "+"milisegundos");
			console.log("Tiempo en el que se manda el segundo mensaje "+numAl2+" "+"milisegundos");
			setTimeout(envio,numAl1);
			setTimeout(envio2,numAl2);
			if (numAl1==numAl2) {
				colision=true;
			}else{
				colision=false;
			}
		}else{
			
			if (colision==true) {
				numsAl2=Math.floor(Math.floor(Math.random()*(5-1)+1));
				numAl2=(1000*numsAl2);
				console.log("Nuevo tiempo para el segundo mensaje: "+numAl2+" "+"milisegundos");
				setTimeout(envio2,numAl2);	
			}else{
				numsAl2=Math.floor(Math.floor(Math.random()*(20-1)+1));
				numAl2=(1000*numsAl2);
				console.log("Nuevo tiempo para el segundo mensaje en enviarse: "+numAl2+" "+"milisegundos");	
				if (msj=="envio1") {
					setTimeout(envio,numAl2);
				}else if (msj=="envio2") {
					setTimeout(envio2,numAl2);
				}
			}
			
		}
	}

	function ensamblarTrama(texto,destino,origen) {
		var bits=[];
		bits.push("Preambulo");
		bits.push("Delimitador");
		bits.push(destino);
		bits.push(origen);
		bits.push("Longitud");
		bits.push(texto);
		bits.push("Relleno");
		bits.push("Chequeo");
		contTrama=contTrama+1;
		return bits;
	}

	function escucharCanal() {
		if (canal==0) {
			if (colision==true) {
				return false;
			}else{
				canal=1;
				return false;
			}
		}else{
			console.log("Se ha detectado que el canal esta ocupado");
			return true;
		}
	}
	function envio() {
		mensaje=document.getElementById('msj1').value;
		var men="envio1";
		var ensamblado=[];
		var dest="Hacia equipo A";
		var ori="Desde equipo B";
		ensamblado=ensamblarTrama(mensaje,dest,ori);
		var escuchado=escucharCanal();

		setTimeout(function () {
			if (escuchado==false) {
				var msj="envio1";
				transmitir(ensamblado,0,men);
			}else{
				prepararEnvio(1,men);
			}	
		},1000);
		
	}
	function envio2() {
		mensaje2=document.getElementById('msj2').value;
		var men="envio2";
		var ensamblado2=[];
		var dest="Hacia equipo B";
		var ori="Desde equipo A";
		ensamblado2=new ensamblarTrama(mensaje2,dest,ori);
		var escuchado=escucharCanal();
		if (escuchado==false) {
			var msj="envio2";
			transmitir(ensamblado2,0,men);
		}else{
			prepararEnvio(1,men);
		}
	}
	function transmitir(ensamblado,con,msj) {
		if (colision==false ) {
			imprimirMSJ=imprimirMSJ+ensamblado[con]+"<br>";
			console.log("Se mando: "+ensamblado[con]);
			con++;
			verificarFin(con,ensamblado,imprimirMSJ,msj);

		}else if (colision==true) {
			if (msj==="envio1") {
				console.log("Se mando: "+ensamblado[con]);
				imprimirMSJ=imprimirMSJ+ensamblado[con]+"<br>";
				con++;
				verificarFin(con,ensamblado,imprimirMSJ,msj);
			}else{
				enviarMasEstaciones(msj);	
			}
		}
	}

	function verificarFin(con,ensamblado,imprimir,msj) {
		if (con<8) {
			setTimeout(function () {
				transmitir(ensamblado,con,msj);	
			},1000);
		}else{
			conGeneral++;
			canal=0;
			colision=false;
			console.log(msj);
			if (msj=="envio1") {
				document.getElementById('resA').innerHTML=imprimirMSJ;
				imprimirMSJ="";
			}else if (msj=="envio2") {
				document.getElementById('resB').innerHTML=imprimirMSJ;
				imprimirMSJ="";
			}
			
		}
	}
	function enviarMasEstaciones(msj) {
		cont++;
		console.log("Contador de colisiones "+cont);
		
		if (cont<5) {
			console.log("Se ha presentado una colision");
			console.log("Se envio el mensaje2 al algoritmo de backoff");
			prepararEnvio(1);
		}else{
			console.log("Se han detectado muchas colisiones");
			alert("Se han detectado muchas colisiones, no llegara el segundo mensaje");
			
		}
	}

}
