const getMenuFront = (role = 'USER_ROLE') => {
    const menu = [
        {
            titulo: 'DashBoard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'ProgressBar', url: 'progress' },
                { titulo: 'Graficas', url: 'grafica1' },
                { titulo: 'Promesas', url: 'promesa' },
                { titulo: 'Rxjs', url: 'rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi fa-fa-openbook',
            submenu: [
                //{ titulo: 'Usuarios', url: 'usuarios' },
                { titulo: 'Hospitales', url: 'hospitales' },
                { titulo: 'Medicos', url: 'medicos' },

            ]
        },
    ];

    if (role === 'ADMIN_ROLE'){
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' });
    }

    return menu;
}

module.exports = { getMenuFront};