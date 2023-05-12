package uy.edu.tsig.bean;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
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
    private String idUser;
    private String pass;


    public void init(){
        usuario= new UsuarioDTO();
    }

    public String iniciarSesion(){
        String redireccion = null;
        UsuarioDTO auxU= UsuarioDTO.builder()
                .usuario(idUser).
                pass(pass)
                .build();
        UsuarioDTO u=iUsuarioSevice.incioSesion(auxU);
        System.out.println(u);
        if(u!=null){
            System.out.println("Entre a encotro");
            redireccion= "/loginPass.xhtml";

            //consulta seccion

        }else{
            FacesContext.getCurrentInstance().addMessage(null,new FacesMessage(FacesMessage.SEVERITY_FATAL, "Aviso", "Credenciales Incorrectas"));
        }
        return redireccion;

    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getPass() {
        return pass;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }
}
