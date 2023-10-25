package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.UserType;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserTypeRepository extends JpaRepository<UserType, Integer> {
}
