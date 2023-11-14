package puj.backend_gui_nodules.model;

import lombok.*;
import puj.backend_gui_nodules.domain.RecordType;
import puj.backend_gui_nodules.domain.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordCompleteDTO {

    private Integer id;
    private LocalDateTime Date;
    private String Uuid;
    private String PatientName;
    private String StudyName;
    private Boolean Seen;
    private byte[] PreviewImage;
    private User Userid;
    private RecordType RecordTypeid;
}
