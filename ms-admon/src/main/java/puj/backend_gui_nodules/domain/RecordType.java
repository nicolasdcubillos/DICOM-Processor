package puj.backend_gui_nodules.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class RecordType {

    @Id
    @Column(nullable = false, updatable = false)
    private Integer id;

    @Column(unique = true)
    private String tipoRegistro;

}
