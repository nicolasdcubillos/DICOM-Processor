package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.Parameter;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ParameterRepository extends JpaRepository<Parameter, Integer> {
}
