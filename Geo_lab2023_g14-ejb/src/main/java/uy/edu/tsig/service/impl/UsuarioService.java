package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Named;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.persistence.IUsuarioDAO;
import uy.edu.tsig.service.IUsuarioSevice;

@Stateless
@Named("usuarioService")
public class UsuarioService implements IUsuarioSevice {

    @EJB
    IUsuarioDAO iUsuarioDAO;
    @Override
    public UsuarioDTO incioSesion(UsuarioDTO u) {
        String usuario= u.getUsuario();
        String pass= u.getPass();
        return iUsuarioDAO.InicioSesion(usuario, pass);
    }
}
