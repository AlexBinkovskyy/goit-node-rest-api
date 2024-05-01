window.onload = async () => {
  try {
    const wrapper = document.querySelector(".wrapper");
    const resp = await fetch(
      `https://node-rest-api-zs36.onrender.com/api/users/verify/${
        window.location.href.split("?")[1]
      }`
    );
    if (resp.status === 404) {
      const message = "User not found...";
      document.querySelector("h1").textContent = message;
    }
    if (resp.status === 200) {
      const message = "Email has been verified successfuly";
      document.querySelector("h1").textContent = message;
    }
  } catch (err) {
    console.log(err);
  }
};
