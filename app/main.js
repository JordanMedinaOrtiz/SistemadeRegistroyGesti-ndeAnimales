const loadInitialTemplate = () => {
	const template = `
		<h1>Animales</h1>
		<form id="animal-form">
			<div>
				<label>Nombre</label>
				<input name="name" />
			</div>
			<div>
				<label>Tipo</label>
				<input name="type" />
			</div>
			<button type="submit">Enviar</button>
		</form>
		<ul id="animal-list"></ul>
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}

const getAnimals = async () => {
	const response = await fetch('/animals', {
    headers: {
      'Authorization': localStorage.getItem('jwt')
    }
  })
	const animals = await response.json()
	const template = animal => `
		<li>
			${animal.name} ${animal.type} <button data-id="${animal._id}">Eliminar</button>
		</li>
	`

	const animalList = document.getElementById('animal-list')
	animalList.innerHTML = animals.map(animal => template(animal)).join('')
	animals.forEach(animal => {
		animalNode = document.querySelector(`[data-id="${animal._id}"]`)
		animalNode.onclick = async e => {
			await fetch(`/animals/${animal._id}`, {
				method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('jwt')
        }
			})
			animalNode.parentNode.remove()
			alert('Eliminado con éxito')
		}
	})
}

const addFormListener = () => {
	const animalForm = document.getElementById('animal-form')
	animalForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(animalForm)
		const data = Object.fromEntries(formData.entries())
		await fetch('/animals', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('jwt')
			}
		})
		animalForm.reset()
		getAnimals()
	}
}

const checkLogin = () => localStorage.getItem('jwt')

const animalsPage = () => {
  loadInitialTemplate()
	addFormListener()
  getAnimals()
}

const loadRegisterTemplate = () => {
  const template = `
  <h1>Register</h1>
  <form id="register-form">
    <div>
      <label>Correo</label>
      <input name="email" />
    </div>
    <div>
      <label>Contraseña</label>
      <input name="password" />
    </div>
    <button type="submit">Enviar</button>
  </form>
  <a href="#" id="login">Iniciar Sesión</a>
  <div id="error"></ul>
`
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template
}

const goToLoginListener = () => {
  const goToLogin = document.getElementById('login')
  goToLogin.onclick = (e) => {
    e.preventDefault()
    loginPage()
  }
}

const registerPage = () => {
  console.log('página de registro')
  loadRegisterTemplate()
	addRegisterListener()
  goToLoginListener()
}

const loginPage = () => {
  loadLoginTemplate()
  addLoginListener()
  goToRegisterListener()
}

const loadLoginTemplate = () => {
  const template = `
  <h1>Login</h1>
  <form id="login-form">
    <div>
      <label>Correo</label>
      <input name="email" />
    </div>
    <div>
      <label>Contraseña</label>
      <input name="password" />
    </div>
    <button type="submit">Enviar</button>
  </form>
  <a href="#" id="register">Registrarse</a>
  <div id="error"></ul>
`
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template
}

const authListener = action => {
  const form = document.getElementById(`${action}-form`)
  form.onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    const response = await fetch(`/${action}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const responseData = await response.text()
    if(response.status >= 300){
      const errorNode = document.getElementById('error')
      errorNode.innerHTML = responseData
    } else{
      localStorage.setItem('jwt', `Bearer ${responseData}`)
      animalsPage()
    }
  }
}

const addLoginListener = () => authListener('login')
const addRegisterListener = () => authListener('register')

const goToRegisterListener = () => {
  const goToRegister = document.getElementById('register')
  goToRegister.onclick = (e) => {
    e.preventDefault()
    registerPage()
  }
}

window.onload = () => {
  const isLogged = checkLogin()
  if (isLogged) {
    animalsPage()
  }else {
    loginPage()
  }
}