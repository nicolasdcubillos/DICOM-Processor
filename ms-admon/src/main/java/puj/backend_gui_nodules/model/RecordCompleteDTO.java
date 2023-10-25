package puj.backend_gui_nodules.model;

import lombok.Getter;
import lombok.Setter;
import puj.backend_gui_nodules.domain.RecordType;
import puj.backend_gui_nodules.domain.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecordCompleteDTO {

    private Integer id;
    private LocalDateTime fecha;
    private String uuid;
    private String nombrePaciente;
    private String nombreEstudio;
    private Boolean seen;
    private byte[] imagenPrevia;
    private User user;
    private RecordType recordType;
}
