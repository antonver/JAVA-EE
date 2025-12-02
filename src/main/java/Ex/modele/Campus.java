package Ex.modele;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Campus {
	
	@Id
	@Column(length=16)
	private String nomC;
	@Column(length=20)
	private String ville;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy="campus", cascade = CascadeType.REMOVE)
	private List<Batiment> batiments;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "universite")
	private Universite universite;

	public Campus() {
	}
	
	public Campus(String nomC, String ville) {
		super();
		this.nomC = nomC;
		this.ville = ville;
		this.batiments = new ArrayList<Batiment>();
	}
	
	public String getNomC() {
		return nomC;
	}
	public void setNomC(String nomC) {
		this.nomC = nomC;
	}
	public String getVille() {
		return ville;
	}
	public void setVille(String ville) {
		this.ville = ville;
	}

	public List<Batiment> getBatiments() {
		return batiments;
	}

	public void setBatiments(List<Batiment> batiments) {
		this.batiments = batiments;
	}

	public Universite getUniversite() {
		return universite;
	}

	public void setUniversite(Universite universite) {
		this.universite = universite;
	}

	@Override
	public String toString() {
		return "Campus [nomC=" + nomC + ", ville=" + ville + "]";
	}
	
}
