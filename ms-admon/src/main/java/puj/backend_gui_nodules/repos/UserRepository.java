package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Integer> {
}
