package uy.edu.tsig.bean;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.service.IUsuarioSevice;

import java.io.Serializable;

@Named("sesion")
@ViewScoped
public class InicioSesionBean implements Serializable {
   @EJB
    IUsuarioSevice iUsuarioSevice;
    private UsuarioDTO usuario;

    @PostConstruct
    public void init(){
        usuario= new UsuarioDTO();
    }
    public String iniciarSesion(String usuario,String pass){
        String redireccion = null;
        UsuarioDTO u=iUsuarioSevice.incioSesion(usuario, pass);

        if(u!=null){
            redireccion= "/Protegido/loguinPass.jsf";
        }
        return redireccion;

    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

}
