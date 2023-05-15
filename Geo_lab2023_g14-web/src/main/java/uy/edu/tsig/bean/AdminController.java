package uy.edu.tsig.bean;

import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.UsuarioDTO;

import java.io.Serializable;

@Named("adminController")
@SessionScoped
public class AdminController implements Serializable {

    public void verificarSesion() {
        try {
            FacesContext FC = FacesContext.getCurrentInstance();
            UsuarioDTO u = (UsuarioDTO) FC.getExternalContext().getSessionMap().get("usuario");

            if (u == null) {
                // acceso sin privilegios
                FC.getExternalContext().redirect("/Geo_lab2023_g14-web/login.xhtml?faces-redirect=true");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
