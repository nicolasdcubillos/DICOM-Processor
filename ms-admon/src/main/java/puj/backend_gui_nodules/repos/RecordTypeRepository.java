package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RecordTypeRepository extends JpaRepository<RecordType, Integer> {

    boolean existsByTipoRegistroIgnoreCase(String tipoRegistro);

}
