package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.UsuarioDTO;

@Remote
public interface IUsuarioSevice {
    UsuarioDTO incioSesion(UsuarioDTO u);
}
