package Ex.modele;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@JsonIgnoreProperties({"salleList", "composanteList"})
public class Batiment {
	
	@Id
	@Column(length=16)
	private String codeB;
	
	@Column(length=4)
	private int anneeC;
	
	@Column
	private Double longitude;
	
	@Column
	private Double latitude;


	@ManyToOne
	@JoinColumn(name="campus")
	@JsonIgnoreProperties({"batiments", "universite"})
	private Campus campus;

	@OneToMany(fetch = FetchType.LAZY, mappedBy="batiment", cascade = CascadeType.REMOVE)
	private List<Salle> salleList;

	@ManyToMany(mappedBy = "batimentList")
	private List<Composante> composanteList;
	
	public Batiment() {} 
	
	public Batiment(String codeB, int anneeC, Campus campus) {
		super();
		this.codeB = codeB;
		this.anneeC = anneeC;
		this.campus = campus;
	}

	public String getCodeB() {
		return codeB;
	}

	public void setCodeB(String codeB) {
		this.codeB = codeB;
	}

	public int getAnneeC() {
		return anneeC;
	}

	public void setAnneeC(int anneeC) {
		this.anneeC = anneeC;
	}

	public Campus getCampus() {
		return campus;
	}

	public void setCampus(Campus campus) {
		this.campus = campus;
	}
	
	@Override
	public String toString() {
		return "Batiment [codeB=" + codeB  + ", anneeC=" + anneeC + "]";
	}
	public Double getLongitude() {
		return longitude;
	}
	
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	
	public Double getLatitude() {
		return latitude;
	}
	
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
}
