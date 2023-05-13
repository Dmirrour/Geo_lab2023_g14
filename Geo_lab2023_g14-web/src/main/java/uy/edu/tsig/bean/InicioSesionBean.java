package uy.edu.tsig.bean;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.service.IUsuarioSevice;

import java.io.Serializable;

@Named("sesion")
@SessionScoped
public class InicioSesionBean implements Serializable {
    @EJB
    // private ??
    IUsuarioSevice iUsuarioSevice;
    private UsuarioDTO usuario;
    private String idUser;
    private String pass;

    public void init() {
        usuario = new UsuarioDTO();
    }

    public String iniciarSesion() {
        String redireccion = null;
        UsuarioDTO auxU = UsuarioDTO.builder()
                .usuario(idUser).pass(pass)
                .build();
        UsuarioDTO u = iUsuarioSevice.incioSesion(auxU);
        System.out.println(u);
        if (u != null) {
            // almacenamos en la variable sesion de JSF
            FacesContext.getCurrentInstance().getExternalContext().getSessionMap().put("usuario", u);
            redireccion = "/admin/inicio.xhtml?faces-redirect=true";
        } else {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_WARN, "Aviso", "Credenciales Incorrectas"));
        }
        return redireccion;

    }

    public String cerrarSesion() {
        System.out.println("cerrarSesion");
        String redireccion = "/Geo_lab2023_g14-web/index.html?faces-redirect=true";
        FacesContext.getCurrentInstance().getExternalContext().invalidateSession();
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
