package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RecordRepository extends JpaRepository<Record, Integer> {
    Optional<Record> findByUuid(String uuid);
}
