package puj.security.repository;

import org.springframework.stereotype.Repository;
import puj.security.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
}
