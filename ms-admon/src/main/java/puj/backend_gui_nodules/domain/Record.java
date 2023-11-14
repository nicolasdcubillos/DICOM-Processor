package puj.backend_gui_nodules.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.*;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Record {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private LocalDateTime Date;

    @Column
    private String Uuid;

    @Column
    private String PatientName;

    @Column
    private String StudyName;

    @Column
    private byte[] PreviewImage;

    @Column
    private Boolean Seen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    private User Userid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_registro_id")
    private RecordType RecordTypeid;

}
