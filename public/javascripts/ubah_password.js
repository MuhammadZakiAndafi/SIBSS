document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const current_password = document.getElementById('current_password').value
        const new_password = document.getElementById('new_password').value
        const confirm_password = document.getElementById('confirm_password').value
        // console.log(current_password,confirm_password,new_password);
        const response = await fetch('/ubahPassword', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                current_password: current_password,
                new_password: new_password,
                confirm_password: confirm_password
            })
        })

        const dataUbahPassword = await response.json()
        console.log(dataUbahPassword);
        if (dataUbahPassword.success) {

            // Informasi login sukses
            Swal.fire({
                title: dataUbahPassword.message,
                timer: 1500,
                icon: "success"
                    });
                    // window.location.href='/ubahpassword'
            // Fetch data setelah login sukses
            
        } else {
            // Informasi login gagal
            Swal.fire({
                title: dataUbahPassword.message,
                timer: 1500,
                icon: "error"
            });
        }
    })
})