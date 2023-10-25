package puj.backend_gui_nodules.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RecordDTO {

    private Integer id;
    private LocalDateTime fecha;
    private String uuid;
    private String nombrePaciente;
    private String nombreEstudio;
    private Boolean seen;
    private byte[] imagenPrevia;
    private Integer usuario;
    private Integer tipoRegistro;

}
