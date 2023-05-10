package uy.edu.tsig.service;

import uy.edu.tsig.dto.UsuarioDTO;

public interface IUsuarioSevice {
    UsuarioDTO incioSesion(String usuario,String pass);
}
