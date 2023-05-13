package uy.edu.tsig.model;

import uy.edu.tsig.dto.UsuarioDTO;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Usuarios implements Serializable {
    private static final Long serialVersionUID = 1L;
    private ArrayList<UsuarioDTO> usuarios;
    public void setListaUsuarios(ArrayList<UsuarioDTO> usuarios) {
        this.usuarios = usuarios;
    }

    public ArrayList<UsuarioDTO> getUsuarios() {
        return usuarios;
    }

}
