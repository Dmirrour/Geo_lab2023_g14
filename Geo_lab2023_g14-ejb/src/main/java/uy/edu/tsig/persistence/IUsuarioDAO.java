package uy.edu.tsig.persistence;

import uy.edu.tsig.dto.UsuarioDTO;

public interface IUsuarioDAO {
    UsuarioDTO buscarUsuario(String usuario);
    UsuarioDTO InicioSecion(String usuario, String pass);
}
