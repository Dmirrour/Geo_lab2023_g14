package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.UsuarioDTO;

@Remote
public interface IUsuarioDAO {
    UsuarioDTO buscarUsuario(String usuario);
    UsuarioDTO InicioSesion(String usuario, String pass);
}
