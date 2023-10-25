package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.UserType;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.model.UserDTO;
import puj.backend_gui_nodules.repos.UserTypeRepository;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;

    public UserService(final UserRepository userRepository,
                       final UserTypeRepository userTypeRepository) {
        this.userRepository = userRepository;
        this.userTypeRepository = userTypeRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(usuario -> mapToDTO(usuario, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Integer id) {
        return userRepository.findById(id)
                .map(usuario -> mapToDTO(usuario, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getId();
    }

    public void update(final Integer id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final Integer id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setId(user.getId());
        userDTO.setNombre(user.getNombre());
        userDTO.setApellido(user.getApellido());
        userDTO.setUsername(user.getUsername());
        userDTO.setPass(user.getPass());
        userDTO.setEmail(user.getEmail());
        userDTO.setTelefono(user.getTelefono());
        userDTO.setTipoUsuario(user.getTipoUsuario() == null ? null : user.getTipoUsuario().getId());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setNombre(userDTO.getNombre());
        user.setApellido(userDTO.getApellido());
        user.setUsername(userDTO.getUsername());
        user.setPass(userDTO.getPass());
        user.setEmail(userDTO.getEmail());
        user.setTelefono(userDTO.getTelefono());
        final UserType tipoUsuario = userDTO.getTipoUsuario() == null ? null : userTypeRepository.findById(userDTO.getTipoUsuario())
                .orElseThrow(() -> new NotFoundException("tipoUsuario not found"));
        user.setTipoUsuario(tipoUsuario);
        return user;
    }

}
