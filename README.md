# IKF
Repositorio para la clase de Informática y Digitalización de 1º de Bachilleraton.
En este proyecto trabajaremos de forma colaborativa para crear una web entre todos.
En este ejercicio cada alumno creará una ficha de personaje siguiendo estas indicaciones:

# Preparación de Archivos

Antes de tocar el código, decide el nombre de tu luchador (ejemplo: `titan_hierro`).

- **Nombre del archivo HTML:**  
  Debe ser `nombre_personaje.html` (ej: `titan_hierro.html`).

- **Nombre de la imagen:**  
  Debe ser exactamente igual: `nombre_personaje.jpg` (o `.png`).

- **Reglas:**  
  Todo en minúsculas, sin espacios, sin tildes y sin la letra **ñ**.

---

## Edición de la Plantilla en VS Code

Abre tu archivo `.html` y modifica los campos siguiendo estas instrucciones:

- **IDs Sagrados (PROHIBIDO TOCAR):**  
  No borres ni modifiques los atributos `id` (ej: `id="puntos-vida"`).  
  El motor del juego busca esas etiquetas exactas para leer tus datos.

- **Regla de los 300 puntos:**  
  La suma de **Vida (HP) + Ataque (ATK) + Velocidad (SPD)** debe ser exactamente **300**.

  - **Ejemplo válido:**  
    Vida 120 + Ataque 120 + Velocidad 60 = 300.

  - **Importante:**  
    En los `<span>` escribe **solo el número**.  

    ❌ `<span>50 HP</span>`  
    ✅ `<span>50</span>`

- **Enlace de Imagen:**  
  En la etiqueta:

  ```html
  <img id="imagen-luchador" src="...">
  Asegúrense que el nombre del fichero de imagen coincida con el del archivo .html

## Documentación del Footer

En el pie de página de tu ficha debes documentar correctamente el uso de la Inteligencia Artificial en el caso de utilizarla.

- **Concepto:**  
  Describe brevemente la idea del personaje y lo que intentabas crear.  
  Ejemplo:  
  *Un guerrero futurista inspirado en circuitos electrónicos y energía eléctrica.*

- **Prompts utilizados:**  
  Incluye las frases **exactas** que usaste en herramientas de IA como ChatGPT, Midjourney u otras.  
  Esto permite evaluar tu capacidad para comunicarte correctamente con la IA.

## Registro y Envío (Git)

Una vez finalizada tu ficha y con la imagen en la misma carpeta:

- **Registro en la arena:**  
  Abre el archivo `participantes.txt` usando VS Code.

- **Añadir participante:**  
  Escribe en una nueva línea **solo el nombre del archivo**, sin la extensión `.html`.

  - **Subida de cambios al repositorio:**  
Ejecuta los siguientes comandos en la terminal, en este orden:

```bash
git pull origin main
git add .
git commit -m "Añadido luchador [Tu Nombre]"
git push origin main



