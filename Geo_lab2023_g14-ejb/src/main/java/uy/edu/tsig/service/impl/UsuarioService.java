package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.persistence.IUsuarioDAO;
import uy.edu.tsig.service.IUsuarioSevice;

public class UsuarioService implements IUsuarioSevice {

    @EJB
    IUsuarioDAO iUsuarioDAO;
    @Override
    public UsuarioDTO incioSesion(String usuario, String pass) {
        return iUsuarioDAO.InicioSecion(usuario, pass);
    }
}
