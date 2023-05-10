package uy.edu.tsig.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;


@Entity(name = "usuario")
@javax.persistence.Table(name = "usuario")
public class Usuario implements Serializable{
	@Id
	private String usuario;
	private String pass;
	
	public Usuario(){
		super();
	}
	
	public Usuario(String usuario,String pass) {
		super();
		this.usuario=usuario;
		this.pass=pass;
	}
	
	public String getUsuario() {
		return usuario;
	}
	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}
	public String getPass() {
		return pass;
	}
	public void setPass(String pass) {
		this.pass = pass;
	}
	
	
}
