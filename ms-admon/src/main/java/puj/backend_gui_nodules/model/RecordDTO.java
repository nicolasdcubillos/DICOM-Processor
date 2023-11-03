package puj.backend_gui_nodules.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordDTO {

    private Integer id;
    private LocalDateTime Date;
    private String Uuid;
    private String PatientName;
    private String StudiName;
    private Boolean Seen;
    private byte[] PreviewImage;
    private Integer Userid;
    private Integer RecordTypeid;

}
