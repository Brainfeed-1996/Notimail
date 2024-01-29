### Routes

<details>
  <summary>POST - authentificate</summary>

```ts
input {
    firm_name: string,
    password:  string,
}
output {
    token: string
}
```

Le token rétourné doit être stocké sur le [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
Et être envoyé dans les prochaines requêtes dans le header `Authorization: Bearer ${token}`

#### Example

```js
const response = await fetch("http://localhost:3000/authentificate", {
  method: "POST",
  body: {
    firm_name: `${firm_name}`,
    password: `${password}`,
  }
});

if (response.ok()) {
  // Authentification réussi
  window.localStorage.setItem("token", response.json().token);
} else {
  // Authentification échoué
}

```

---

</details>

<details>
  <summary>GET - list_users</summary>

```ts
output [ firm_name: string ]
```

#### Example

```js
const response = await fetch("http://localhost:3000/list_users", {
  method: "GET",
});

if response.ok() {
  let user_list = response.body();
} else {
  // Erreur
}
 
```

---

</details>

<details>
  <summary>POST - create_user</summary>

```ts
input {
    firm_name:    string,
    first_name:   string,
    last_name:    string,
    email:        string,
    phone_number: string,
    password: string,
    is_admin: boolean,
}
```

#### Example

```js
const response = await fetch("http://localhost:3000/create_user", {
  method: "POST",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
  body: {
    firm_name: `${firm_name}`,
    first_name: `${first_name}`,
    last_name: `${last_name}`,
    email: `${email}`,
    phone_numer: `${phone_number}`,
    password: `${password}`,
    is_admin: `${is_admin}`,
  }
});
if (!response.ok()) {
  // Creation réussi
} else {
  // Création échoué
}
```

---

</details>

<details>
  <summary>DELETE - delete_user</summary>

```ts
input {
    firm_name: string,
}
```

#### Example

```js
const response = await fetch("http://localhost:3000/delete_user", {
  method: "DELETE",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
  body: {
    firm_name: `${firm_name}`,
  }
});
if (!response.ok()) {
  // Suppression réussi
} else {
  // Suppression échoué
}
```

---

</details>

<details>
  <summary>PUT - update_user</summary>

```ts
input {
    firm_name:    string,
    first_name:   string | undefined,
    last_name:    string | undefined,
    email:        string | undefined,
    phone_number: string | undefined,
    password:     string | undefined,
    has_mail:  boolean | undefined,
    is_admin: boolean | undefined,
}
```

#### Example

##### Notifier d'un nouveau courrier

```js
const response = await fetch("http://localhost:3000/update_user", {
  method: "PUT",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
  body: {
    firm_name: `${firm_name}`,
    has_mail: true,
  }
});
if (!response.ok()) {
  // Changement réussi
} else {
  // Changement échoué
}
```

##### Récupération d'un courrier

```js
const response = await fetch("http://localhost:3000/update_user", {
  method: "PUT",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
  body: {
    firm_name: `${firm_name}`,
    has_mail: false,
  }
});
if (!response.ok()) {
  // Changement réussi
} else {
  // Changement échoué
}
```

##### Modification des informations

```js
const response = await fetch("http://localhost:3000/update_user", {
  method: "PUT",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
  body: {
    firm_name: `${firm_name}`,
    // Chacun des champs qui suivent peuvent être omis pour modifier uniquement les données nécessaires
    first_name:   `${first_name}`,
    last_name:    `${name}`,
    email:        `${email}`,
    phone_number: `${phone_number}`,
    password:     `${password}`,
    is_admin: `${is_admin}`,
  }
});
if (!response.ok()) {
  // Changement réussi
} else {
  // Changement échoué
}
```

---

</details>

<details>
  <summary>GET - get_user/:user</summary>

```ts
output {
    first_name:   string,
    last_name:    string,
    email:        string,
    phone_number: string,
    last_received_mail: string, // Timestamp
    last_picked_up:     string, // Timestamp
    has_mail: boolean,
    is_admin: boolean,
}
```

#### Example

```js
const response = await fetch(`http://localhost:3000/get_user/${firm_name}`, {
  method: "GET",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
});
if (!response.ok()) {
  // Changement réussi
  const user = response.json();
  // 'user' contient toute les données décrit plus haut dans 'output'
} else {
  // Changement échoué
}
```

---

</details>

<details>
  <summary>POST - disconnect</summary>

```js
const response = await fetch("http://localhost:3000/disconnect", {
  method: "POST",
  headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
});
if (!response.ok()) {
  // Déconnection réussi
} else {
  // Déconnection échoué
  // Cette échec peut-être ignoré
}

// Suprime le token du local storage
window.localStorage.setItem("token", undefined);
```

---

</details>
