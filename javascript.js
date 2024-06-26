class Portada extends Phaser.Scene {
    constructor() {
        super({ key: "Portada" });
    }

    preload() {
        this.load.image("portada", "img/portada.png");
        this.load.audio("music", "sound/pingpongmusic.mp3");
        this.load.image("botonInicio", "img/startgame.png");
        this.load.image("botonCreditos", "img/creditos.png");
        this.load.image("botonSalir", "img/salir.png");
        this.load.image("titulo", "img/ssd.png");
    }

    create() {
        // Añadir fondo
        this.add.image(480, 320, "portada");
        this.add.image(480, 120, "titulo");

        // Añadir música de fondo
        this.menuMusic = this.sound.add("music", { loop: true, volume: 0.5 });
        this.menuMusic.play();

        // Credito
        this.add
            .text(480, 550, "Diseñado por Sergio Alexander Huayllas", {
                font: "14px Arial bold",
                fill: "white",
                backgroundColor: "#000000",
            })
            .setOrigin(0.5);

        // Añadir botones con espacio incrementado
        this.crearBoton(
            350,
            450,
            "botonInicio",
            () => {
                this.menuMusic.stop();
                this.scene.start("Escena");
            },
            0.3
        ); // Redimensionar botón de inicio

        this.crearBoton(
            620,
            450,
            "botonCreditos",
            () => {
                this.menuMusic.stop();
                this.scene.start("Creditos");
            },
            0.3
        ); // Redimensionar botón de créditos
    }

    crearBoton(x, y, imagen, accion, scale = 1) {
        let btn = this.add.image(x, y, imagen).setInteractive();
        btn.setScale(scale); // Ajustar la escala del botón
        btn.on("pointerdown", accion);
        btn.on("pointerover", () => {
            btn.setScale(scale * 1.1); // Hacer el botón un poco más grande al pasar el ratón
            btn.setTint(0xcccccc); // Cambiar el color a un gris claro
        });
        btn.on("pointerout", () => {
            btn.setScale(scale); // Restaurar el tamaño original
            btn.clearTint(); // Eliminar el tintado
        });
    }
}
class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: "Creditos" });
    }

    preload() {
        this.load.image("portada", "img/portada.png");
        this.load.audio("music", "sound/pingpongmusic.mp3");
        //this.load.image("botonInicio", "img/startgame.png");
        // this.load.image("botonCreditos", "img/creditos.png");
        this.load.image("botonSalir", "img/salir.png");
        // this.load.image("titulo", "img/ssd.png");
    }

    create() {
        // Añadir fondo
        this.add.image(480, 320, "portada");
        //this.add.image(480, 120, "titulo");

        // Añadir música de fondo
        this.menuMusic = this.sound.add("music", { loop: true, volume: 0.5 });
        this.menuMusic.play();

        // Credito
        this.add
            .text(480, 150, "CREDITOS", {
                font: "40px Arial bold",
                fill: "white",
                backgroundColor: "#000000",
            })
            .setOrigin(0.5);
        // Credito
        this.add
            .text(490, 220, "Sergio Alexander Huayllas        U19221872", {
                font: "16px Arial bold",
                fill: "white",
                backgroundColor: "#000000",
            })
            .setOrigin(0.5);
        // Añadir botones con espacio incrementado
        this.crearBoton(
            480,
            550,
            "botonSalir",
            () => {
                this.menuMusic.stop();
                this.scene.start("Portada");
            },
            0.3
        );
    }

    crearBoton(x, y, imagen, accion, scale = 1) {
        let btn = this.add.image(x, y, imagen).setInteractive();
        btn.setScale(scale); // Ajustar la escala del botón
        btn.on("pointerdown", accion);
        btn.on("pointerover", () => {
            btn.setScale(scale * 1.1); // Hacer el botón un poco más grande al pasar el ratón
            btn.setTint(0xcccccc); // Cambiar el color a un gris claro
        });
        btn.on("pointerout", () => {
            btn.setScale(scale); // Restaurar el tamaño original
            btn.clearTint(); // Eliminar el tintado
        });
    }
}

class Escena extends Phaser.Scene {
    constructor() {
        super({ key: "Escena" });
        this.limitePuntos = 5;
        this.audio = null; // Variable global para el audio
        this.mano2Direction = 0; // Dirección actual de mano2
        this.mano2Speed = 5; // Velocidad de movimiento de mano2
        this.changeDirectionTimer = 0; // Temporizador para cambio de dirección
        this.directionChangeInterval = 500; // Intervalo en ms para cambiar la dirección
        this.vidas = 4; // Número inicial de vidas
        this.textoVidas = null; // Objeto de texto para mostrar las vidas
        this.lastCommandTime = 0;
        this.commandCooldown = 0; // 1 segundo entre comandos
    }

    preload() {
        this.load.image("fondo", "img/fondo.jpg");
        this.load.spritesheet("bola", "img/bola.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.image("mano1", "img/mano1.png");
        this.load.image("leftbtn", "img/flecha.png");
        this.load.image("mano2", "img/mano2.png");
        this.load.audio("audio", "sound/pingpongmusic.mp3");
        this.load.audio("rebote", "sound/bounce.mp3");
        this.load.image("salida", "img/salir.png");
    }

    create() {
        this.initializeVoiceControl();
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.image(480, 320, "fondo");
        this.pintarVidas();

        this.crearBoton(
            480,
            550,
            "salida",
            () => {
                this.audio.stop();
                this.scene.start("Portada");
            },
            0.3
        );
        this.bola = this.physics.add.sprite(480, 320, "bola");

        this.anims.create({
            key: "brillar",
            frames: this.anims.generateFrameNumbers("bola", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.bola.play("brillar");

        //primer jugador
        this.bola.setBounce(1);
        this.mano1 = this.physics.add.sprite(70, 320, "mano1");
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.mano1.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano1);
        this.mano1.setCollideWorldBounds(true);

        //segudo jugador

        this.mano2 = this.physics.add.sprite(882, 320, "mano2");
        this.mano2.body.immovable = true;
        this.bola.setBounce(10);
        this.mano2.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano2);
        this.mano2.setCollideWorldBounds(true);

        // Añadir audio de rebote
        this.reboteSound = this.sound.add("rebote");

        // Configurar colisiones
        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );

        const velocidad = 500;
        let anguloInicial = (Math.random() * Math.PI) / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);

        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales(
            {
                x: 50,
                y: 50,
            },

            { x: 50, y: 590 },
            this.mano1
        );

        //controles visuales del segundo jugador
        this.controlesVisuales(
            {
                x: 910,
                y: 50,
            },

            { x: 910, y: 590 },
            this.mano2
        );
        this.alguienGano = false;

        this.pintarMarcador();
        // Inicializar o reanudar el audio
        if (!this.audio) {
            this.audio = this.sound.add("audio", { loop: true, volume: 0.1 });
            this.audio.play();
        } else {
            this.audio.resume();
        }
    }
    initializeVoiceControl() {
        if ("webkitSpeechRecognition" in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = "es-ES";
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript
                    .trim()
                    .toLowerCase();

                console.log("Comando de voz:", command);
                this.processVoiceCommand(command);
            };

            recognition.onerror = (event) => {
                console.error(
                    "Error en el reconocimiento de voz:",
                    event.error
                );
            };

            recognition.start();
        } else {
            console.error("El navegador no soporta la Web Speech API");
        }
    }

    processVoiceCommand(command) {
        const step = 100; // Este es el paso que la mano se moverá hacia arriba o hacia abajo.
        if (command.includes("arriba")) {
            // Mover la mano hacia arriba, pero prevenir que se mueva más allá del borde superior.
            this.mano1.y = Math.max(
                this.mano1.y - step,
                this.mano1.displayHeight / 2
            );
        } else if (command.includes("abajo")) {
            // Mover la mano hacia abajo, pero prevenir que se mueva más allá del borde inferior.
            this.mano1.y = Math.min(
                this.mano1.y + step,
                this.game.config.height - this.mano1.displayHeight / 2
            );
        }
    }
    playReboteSound(bola, mano) {
        console.log("Rebote!"); // Verifica que se imprima esto en la consola al colisionar
        this.reboteSound.play();
    }
    update(time, delta) {
        if (this.bola.x < 0) {
            // Condición de ejemplo
            this.perderVida();
        }
        this.bola.rotation += 0.01;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota();
        }
        // if (this.bola.x > config.width || this.bola.x < 0) {
        //     this.bola.body.velocity.x = -this.bola.body.velocity.x;
        // }
        // if (this.bola.y > config.height || this.bola.y < 0) {
        //     this.bola.body.velocity.y = -this.bola.body.velocity.y;
        // }

        if (
            this.cursors.up.isDown ||
            this.mano1.getData("direccionVertical") === -1
        ) {
            this.mano1.y = this.mano1.y - 5;
        } else if (
            this.cursors.down.isDown ||
            this.mano1.getData("direccionVertical") === 1
        ) {
            this.mano1.y = this.mano1.y + 5;
        }

        if (this.changeDirectionTimer > this.directionChangeInterval) {
            this.mano2Direction = Math.random() < 0.5 ? -1 : 1; // Cambia la dirección aleatoriamente a -1 o 1
            this.changeDirectionTimer = 0; // Reiniciar el temporizador
        } else {
            this.changeDirectionTimer += delta; // Incrementar el temporizador
        }

        // Mover la mano2 basado en la dirección aleatoria
        if (this.mano2.y > 60 && this.mano2.y < 560) {
            // Asegúrate de que la mano2 no salga de los límites
            this.mano2.y += this.mano2Direction * this.mano2Speed;
        } else if (this.mano2.y <= 60) {
            this.mano2.y += this.mano2Speed; // Corregir si está demasiado arriba
        } else if (this.mano2.y >= 560) {
            this.mano2.y -= this.mano2Speed; // Corregir si está demasiado abajo
        }
        this.revisarPuntaje();
    }
    pintarVidas() {
        if (this.textoVidas) {
            this.textoVidas.destroy(); // Eliminar el texto antiguo para crear uno nuevo
        }
        this.textoVidas = this.add.text(100, 10, "Vidas: " + this.vidas, {
            fontSize: "32px",
            fill: "#FFFFFF",
            fontStyle: "bold",
        });
    }
    perderVida() {
        this.vidas -= 1;
        this.pintarVidas();

        if (this.vidas <= 0) {
            this.ganador("NPC GANA");
        }
    }
    colocarPelota() {
        const velocidad = 500;
        let anguloInicial =
            Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, "bola");
        this.bola.play("brillar");

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );
        this.alguienGano = false;
    }

    pintarMarcador() {
        this.marcadorMano1 = this.add
            .text(440, 75, "0", {
                fontFamily: "font1",
                fontSize: 80,
                color: "white",
                align: "right",
            })
            .setOrigin(1, 0);
        this.marcadorMano2 = this.add.text(520, 75, "0", {
            fontFamily: "font1",
            fontSize: 80,
            color: "white",
        });
    }

    revisarPuntaje() {
        if (this.marcadorMano1.text >= this.limitePuntos) {
            this.ganador("Jugador 1");
        } else if (this.marcadorMano2.text >= this.limitePuntos) {
            this.ganador("Jugador 2");
        }
    }
    ganador(jugador) {
        if (jugador === "Jugador 1") {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(270, 150, jugador + " \n¡Gana el juego! ", {
                fontFamily: "font1 ",
                fontSize: 80,
                color: "white",
                align: "center",
            });

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                }
                this.scene.start("Nivel2");
            }, 3000);
        } else {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(
                270,
                150,
                jugador + " \n¡Gana el juego! \nFin del juego",
                {
                    fontFamily: "font1 ",
                    fontSize: 80,
                    color: "white",
                    align: "right",
                }
            );

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                    this.vidas = 4;
                }
                this.scene.start("Portada");
            }, 3000);
        }
    }
    controlesVisuales(btn1, btn2, player) {
        player.setData("direccionVertical", 0);

        const upbtn = this.add
            .sprite(btn1.x, btn1.y, "leftbtn")
            .setInteractive();
        const downbtn = this.add
            .sprite(btn2.x, btn2.y, "leftbtn")
            .setInteractive();
        downbtn.flipY = true;

        downbtn.on("pointerdown", () => {
            player.setData("direccionVertical", 1);
        });

        upbtn.on("pointerdown", () => {
            player.setData("direccionVertical", -1);
        });

        downbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });

        upbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });
    }
    crearBoton(x, y, imagen, accion, scale = 1) {
        let btn = this.add.image(x, y, imagen).setInteractive();
        btn.setScale(scale); // Ajustar la escala del botón
        btn.on("pointerdown", accion);
        btn.on("pointerover", () => {
            btn.setScale(scale * 1.1); // Hacer el botón un poco más grande al pasar el ratón
            btn.setTint(0xcccccc); // Cambiar el color a un gris claro
        });
        btn.on("pointerout", () => {
            btn.setScale(scale); // Restaurar el tamaño original
            btn.clearTint(); // Eliminar el tintado
        });
    }
}
class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: "Nivel2" });
        this.limitePuntos = 5;
        this.audio = null; // Variable global para el audio
        this.changeDirectionTimer = 0; // Temporizador para cambio de dirección
        this.directionChangeInterval = 500; // Intervalo en ms para cambiar la dirección
        this.vidas = 4; // Número inicial de vidas
        this.textoVidas = null; // Objeto de texto para mostrar las vidas
        this.lastCommandTime = 0;
        this.commandCooldown = 0; // 1 segundo entre comandos
    }
    preload() {
        this.load.image("fondo2", "img/fondo2.png");
        this.load.spritesheet("bola", "img/bola.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.spritesheet("bola2", "img/bola.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.image("ping", "img/ping.png");
        this.load.image("leftbtn", "img/flecha.png");
        this.load.image("pong", "img/pong.png");
        this.load.audio("audio", "sound/pingpongmusic.mp3");
        this.load.audio("rebote", "sound/bounce.mp3");
        this.load.image("salida", "img/salir.png");
    }

    create() {
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.image(480, 320, "fondo2");
        this.pintarVidas();
        this.crearBoton(
            480,
            550,
            "salida",
            () => {
                this.audio.stop();
                this.scene.start("Portada");
            },
            0.3
        );
        this.bola = this.physics.add.sprite(480, 320, "bola");

        this.bola2 = this.physics.add.sprite(480, 320, "bola2");

        this.anims.create({
            key: "brillar",
            frames: this.anims.generateFrameNumbers("bola", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.bola.play("brillar");

        this.bola2.play("brillar");

        //primer jugador
        this.bola.setBounce(1);
        this.mano1 = this.physics.add.sprite(110, 320, "ping");
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.mano1.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano1);
        // this.physics.add.collider(this.bola2, this.mano1);
        this.mano1.setCollideWorldBounds(true);

        //segudo jugador

        this.mano2 = this.physics.add.sprite(842, 320, "pong");
        this.mano2.body.immovable = true;
        this.bola.setBounce(10);
        this.mano2.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano2);
        // this.physics.add.collider(this.bola2, this.mano2);
        this.mano2.setCollideWorldBounds(true);

        // Añadir audio de rebote
        this.reboteSound = this.sound.add("rebote");
        // Configurar colisiones
        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );

        // Configurar colisiones
        this.physics.add.collider(
            this.bola2,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola2,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );
        const velocidad = 500;
        let anguloInicial = (Math.random() * Math.PI) / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.bola2.setBounce(1);
        this.bola2.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.bola2.body.velocity.x = vx - 60;
        this.bola2.body.velocity.y = vy - 60;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales(
            {
                x: 50,
                y: 50,
            },

            { x: 50, y: 590 },
            this.mano1
        );

        //controles visuales del segundo jugador
        this.controlesVisuales(
            {
                x: 910,
                y: 50,
            },

            { x: 910, y: 590 },
            this.mano2
        );
        this.alguienGano = false;

        this.pintarMarcador();
        // Inicializar o reanudar el audio
        if (!this.audio) {
            this.audio = this.sound.add("audio", { loop: true, volume: 0.1 });
            this.audio.play();
        } else {
            this.audio.resume();
        }
    }
    playReboteSound(bola, mano) {
        console.log("Rebote!"); // Verifica que se imprima esto en la consola al colisionar
        this.reboteSound.play();
    }
    update() {
        if (this.bola.x < 0 || this.bola2.x < 0) {
            // Condición de ejemplo
            this.perderVida();
        }
        this.bola.rotation += 0.01;
        this.bola2.rotation += 0.01;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota();
        }

        if (this.bola2.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota2();
        } else if (this.bola2.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota2();
        }

        // if (this.bola.x > config.width || this.bola.x < 0) {
        //     this.bola.body.velocity.x = -this.bola.body.velocity.x;
        // }
        // if (this.bola.y > config.height || this.bola.y < 0) {
        //     this.bola.body.velocity.y = -this.bola.body.velocity.y;
        // }

        if (
            this.cursors.up.isDown ||
            this.mano1.getData("direccionVertical") === -1
        ) {
            this.mano1.y = this.mano1.y - 5;
        } else if (
            this.cursors.down.isDown ||
            this.mano1.getData("direccionVertical") === 1
        ) {
            this.mano1.y = this.mano1.y + 5;
        }

        //movimientos del segundo jugador
        if (
            this.cursors.up.isDown ||
            this.mano2.getData("direccionVertical") === -1
        ) {
            this.mano2.y = this.mano2.y - 5;
        } else if (
            this.cursors.down.isDown ||
            this.mano2.getData("direccionVertical") === 1
        ) {
            this.mano2.y = this.mano2.y + 5;
        }
        this.revisarPuntaje();
    }
    pintarVidas() {
        if (this.textoVidas) {
            this.textoVidas.destroy(); // Eliminar el texto antiguo para crear uno nuevo
        }
        this.textoVidas = this.add.text(100, 10, "Vidas: " + this.vidas, {
            fontSize: "32px",
            fill: "#FFFFFF",
            fontStyle: "bold",
        });
    }
    perderVida() {
        this.vidas -= 1;
        this.pintarVidas();

        if (this.vidas <= 0) {
            this.ganador("NPC GANA");
        }
    }
    colocarPelota() {
        const velocidad = 500;
        let anguloInicial =
            Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, "bola");
        this.bola.play("brillar");

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );

        this.alguienGano = false;
    }
    colocarPelota2() {
        const velocidad = 500;
        let anguloInicial =
            Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;
        this.bola2 = this.physics.add.sprite(480, 320, "bola2");
        this.bola2.play("brillar");

        this.bola2.setBounce(1);
        this.physics.world.enable(this.bola2);
        this.bola2.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola2.body.velocity.x = vx + 20;
        this.bola2.body.velocity.y = vy + 30;
        // Configurar colisiones
        this.physics.add.collider(
            this.bola2,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola2,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );
        this.alguienGano = false;
    }
    pintarMarcador() {
        this.marcadorMano1 = this.add
            .text(440, 75, "0", {
                fontFamily: "font1",
                fontSize: 80,
                color: "white",
                align: "right",
            })
            .setOrigin(1, 0);
        this.marcadorMano2 = this.add.text(520, 75, "0", {
            fontFamily: "font1",
            fontSize: 80,
            color: "white",
        });
    }
    revisarPuntaje() {
        if (this.marcadorMano1.text >= this.limitePuntos) {
            this.ganador("Jugador 1");
        } else if (this.marcadorMano2.text >= this.limitePuntos) {
            this.ganador("Jugador 2");
        }
    }
    ganador(jugador) {
        if (jugador === "Jugador 1") {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(270, 150, jugador + " \n¡Gana el juego! ", {
                fontFamily: "font1 ",
                fontSize: 80,
                color: "white",
                align: "center",
            });

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                }
                this.scene.start("Nivel3");
            }, 3000);
        } else {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(
                270,
                150,
                jugador + " \n¡Gana el juego! \nFin del juego",
                {
                    fontFamily: "font1 ",
                    fontSize: 80,
                    color: "white",
                    align: "right",
                }
            );

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                    this.vidas = 4;
                }
                this.scene.start("Portada");
            }, 3000);
        }
    }
    controlesVisuales(btn1, btn2, player) {
        player.setData("direccionVertical", 0);

        const upbtn = this.add
            .sprite(btn1.x, btn1.y, "leftbtn")
            .setInteractive();
        const downbtn = this.add
            .sprite(btn2.x, btn2.y, "leftbtn")
            .setInteractive();
        downbtn.flipY = true;

        downbtn.on("pointerdown", () => {
            player.setData("direccionVertical", 1);
        });

        upbtn.on("pointerdown", () => {
            player.setData("direccionVertical", -1);
        });

        downbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });

        upbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });
    }
    crearBoton(x, y, imagen, accion, scale = 1) {
        let btn = this.add.image(x, y, imagen).setInteractive();
        btn.setScale(scale); // Ajustar la escala del botón
        btn.on("pointerdown", accion);
        btn.on("pointerover", () => {
            btn.setScale(scale * 1.1); // Hacer el botón un poco más grande al pasar el ratón
            btn.setTint(0xcccccc); // Cambiar el color a un gris claro
        });
        btn.on("pointerout", () => {
            btn.setScale(scale); // Restaurar el tamaño original
            btn.clearTint(); // Eliminar el tintado
        });
    }
}
class Nivel3 extends Phaser.Scene {
    constructor() {
        super({ key: "Nivel3" });
        this.limitePuntos = 5;
        this.audio = null; // Variable global para el audio
        this.changeDirectionTimer = 0; // Temporizador para cambio de dirección
        this.directionChangeInterval = 500; // Intervalo en ms para cambiar la dirección
        this.vidas = 4; // Número inicial de vidas
        this.textoVidas = null; // Objeto de texto para mostrar las vidas
        this.lastCommandTime = 0;
        this.commandCooldown = 0; // 1 segundo entre comandos
    }
    preload() {
        this.load.image("fondo3", "img/fondo3.png");
        this.load.spritesheet("bola", "img/bola.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.spritesheet("bola2", "img/bola.png", {
            frameWidth: 100,
            frameHeight: 100,
        });
        this.load.image("predatorhand", "img/predatorhand.png");
        this.load.image("leftbtn", "img/flecha.png");
        this.load.image("alienhand", "img/alienhand.png");
        this.load.audio("audio", "sound/pingpongmusic.mp3");
        this.load.audio("rebote", "sound/bounce.mp3");

        this.load.image("salida", "img/salir.png");
    }

    create() {
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.add.image(480, 320, "fondo3");
        this, this.pintarVidas();
        this.crearBoton(
            480,
            550,
            "salida",
            () => {
                this.audio.stop();
                this.scene.start("Portada");
            },
            0.3
        );
        this.bola = this.physics.add.sprite(480, 320, "bola");

        this.bola2 = this.physics.add.sprite(480, 320, "bola2");

        this.anims.create({
            key: "brillar",
            frames: this.anims.generateFrameNumbers("bola", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.bola.play("brillar");

        this.bola2.play("brillar");

        //primer jugador
        this.bola.setBounce(1);
        this.mano1 = this.physics.add.sprite(110, 320, "predatorhand");
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.mano1.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano1);
        // this.physics.add.collider(this.bola2, this.mano1);
        this.mano1.setCollideWorldBounds(true);

        //segudo jugador

        this.mano2 = this.physics.add.sprite(842, 320, "alienhand");
        this.mano2.body.immovable = true;
        this.bola.setBounce(10);
        this.mano2.setSize(60, 250);
        // this.physics.add.collider(this.bola, this.mano2);
        // this.physics.add.collider(this.bola2, this.mano2);
        this.mano2.setCollideWorldBounds(true);

        // Añadir audio de rebote
        this.reboteSound = this.sound.add("rebote");
        // Configurar colisiones
        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );

        // Configurar colisiones
        this.physics.add.collider(
            this.bola2,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola2,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );
        const velocidad = 500;
        let anguloInicial = (Math.random() * Math.PI) / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.bola2.setBounce(1);
        this.bola2.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.bola2.body.velocity.x = vx - 60;
        this.bola2.body.velocity.y = vy - 60;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales(
            {
                x: 50,
                y: 50,
            },

            { x: 50, y: 590 },
            this.mano1
        );

        //controles visuales del segundo jugador
        this.controlesVisuales(
            {
                x: 910,
                y: 50,
            },

            { x: 910, y: 590 },
            this.mano2
        );
        this.alguienGano = false;

        this.pintarMarcador();
        // Inicializar o reanudar el audio
        if (!this.audio) {
            this.audio = this.sound.add("audio", { loop: true, volume: 0.1 });
            this.audio.play();
        } else {
            this.audio.resume();
        }
    }
    playReboteSound(bola, mano) {
        console.log("Rebote!"); // Verifica que se imprima esto en la consola al colisionar
        this.reboteSound.play();
    }
    update() {
        if (this.bola.x < 0 || this.bola2.x < 0) {
            // Condición de ejemplo
            this.perderVida();
        }
        this.bola.rotation += 0.01;
        this.bola2.rotation += 0.01;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota();
        }

        if (this.bola2.x < 0 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota2();
        } else if (this.bola2.x > 960 && this.alguienGano === false) {
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota2();
        }

        // if (this.bola.x > config.width || this.bola.x < 0) {
        //     this.bola.body.velocity.x = -this.bola.body.velocity.x;
        // }
        // if (this.bola.y > config.height || this.bola.y < 0) {
        //     this.bola.body.velocity.y = -this.bola.body.velocity.y;
        // }

        if (
            this.cursors.up.isDown ||
            this.mano1.getData("direccionVertical") === -1
        ) {
            this.mano1.y = this.mano1.y - 5;
        } else if (
            this.cursors.down.isDown ||
            this.mano1.getData("direccionVertical") === 1
        ) {
            this.mano1.y = this.mano1.y + 5;
        }

        //movimientos del segundo jugador
        if (
            this.cursors.up.isDown ||
            this.mano2.getData("direccionVertical") === -1
        ) {
            this.mano2.y = this.mano2.y - 5;
        } else if (
            this.cursors.down.isDown ||
            this.mano2.getData("direccionVertical") === 1
        ) {
            this.mano2.y = this.mano2.y + 5;
        }
        this.revisarPuntaje();
    }
    colocarPelota() {
        const velocidad = 800;
        let anguloInicial =
            Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, "bola");
        this.bola.play("brillar");

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.physics.add.collider(
            this.bola,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );

        this.alguienGano = false;
    }
    colocarPelota2() {
        const velocidad = 800;
        let anguloInicial =
            Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;
        this.bola2 = this.physics.add.sprite(480, 320, "bola2");
        this.bola2.play("brillar");

        this.bola2.setBounce(1);
        this.physics.world.enable(this.bola2);
        this.bola2.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola2.body.velocity.x = vx + 20;
        this.bola2.body.velocity.y = vy + 30;
        // Configurar colisiones
        this.physics.add.collider(
            this.bola2,
            this.mano1,
            this.playReboteSound,
            null,
            this
        );
        this.physics.add.collider(
            this.bola2,
            this.mano2,
            this.playReboteSound,
            null,
            this
        );
        this.alguienGano = false;
    }
    pintarVidas() {
        if (this.textoVidas) {
            this.textoVidas.destroy(); // Eliminar el texto antiguo para crear uno nuevo
        }
        this.textoVidas = this.add.text(100, 10, "Vidas: " + this.vidas, {
            fontSize: "32px",
            fill: "#FFFFFF",
            fontStyle: "bold",
        });
    }
    perderVida() {
        this.vidas -= 1;
        this.pintarVidas();

        if (this.vidas <= 0) {
            this.ganador("NPC GANA");
        }
    }
    pintarMarcador() {
        this.marcadorMano1 = this.add
            .text(440, 75, "0", {
                fontFamily: "font1",
                fontSize: 80,
                color: "white",
                align: "right",
            })
            .setOrigin(1, 0);
        this.marcadorMano2 = this.add.text(520, 75, "0", {
            fontFamily: "font1",
            fontSize: 80,
            color: "white",
        });
    }
    revisarPuntaje() {
        if (this.marcadorMano1.text >= this.limitePuntos) {
            this.ganador("Jugador 1");
        } else if (this.marcadorMano2.text >= this.limitePuntos) {
            this.ganador("Jugador 2");
        }
    }
    ganador(jugador) {
        if (jugador === "Jugador 1") {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(
                270,
                150,
                jugador + "\n¡Gana el juego!\nFin del juego",
                {
                    fontFamily: "font1 ",
                    fontSize: 80,
                    color: "white",
                    align: "center",
                }
            );

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                }
                this.scene.start("Portada");
            }, 3000);
        } else {
            console.log(jugador + " gana el juego!");
            // Mostrar en pantalla el ganador
            this.add.text(
                270,
                150,
                jugador + " \n¡Gana el juego! \nFin del juego",
                {
                    fontFamily: "font1 ",
                    fontSize: 80,
                    color: "white",
                    align: "right",
                }
            );

            // Desactivar actualizaciones en la escena sin pausar completamente
            this.scene.pause();
            this.input.enabled = false; // Deshabilitar entradas del usuario

            // Establecer un temporizador para reanudar y reiniciar la escena
            setTimeout(() => {
                this.scene.resume();
                if (this.audio) {
                    this.audio.stop();
                    this.audio = null;
                    this.vidas = 4;
                }
                this.scene.start("Portada");
            }, 3000);
        }
    }
    controlesVisuales(btn1, btn2, player) {
        player.setData("direccionVertical", 0);

        const upbtn = this.add
            .sprite(btn1.x, btn1.y, "leftbtn")
            .setInteractive();
        const downbtn = this.add
            .sprite(btn2.x, btn2.y, "leftbtn")
            .setInteractive();
        downbtn.flipY = true;

        downbtn.on("pointerdown", () => {
            player.setData("direccionVertical", 1);
        });

        upbtn.on("pointerdown", () => {
            player.setData("direccionVertical", -1);
        });

        downbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });

        upbtn.on("pointerup", () => {
            player.setData("direccionVertical", 0);
        });
    }
    crearBoton(x, y, imagen, accion, scale = 1) {
        let btn = this.add.image(x, y, imagen).setInteractive();
        btn.setScale(scale); // Ajustar la escala del botón
        btn.on("pointerdown", accion);
        btn.on("pointerover", () => {
            btn.setScale(scale * 1.1); // Hacer el botón un poco más grande al pasar el ratón
            btn.setTint(0xcccccc); // Cambiar el color a un gris claro
        });
        btn.on("pointerout", () => {
            btn.setScale(scale); // Restaurar el tamaño original
            btn.clearTint(); // Eliminar el tintado
        });
    }
}
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Portada,
    Escena,
    Nivel2,
    Nivel3,
    Creditos,

    physics: {
        default: "arcade",
    },
    scene: [Portada, Escena, Nivel2, Nivel3, Creditos],
};

new Phaser.Game(config);
