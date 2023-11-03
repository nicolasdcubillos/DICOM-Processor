package puj.backend_gui_nodules.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordType {

    @Id
    @Column(nullable = false, updatable = false)
    private Integer id;

    @Column(unique = true)
    private String RecordType;

}
