package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.UserType;
import puj.backend_gui_nodules.model.UserTypeDTO;
import puj.backend_gui_nodules.repos.UserTypeRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserTypeService {

    private final UserTypeRepository userTypeRepository;

    public UserTypeService(final UserTypeRepository userTypeRepository) {
        this.userTypeRepository = userTypeRepository;
    }

    public List<UserTypeDTO> findAll() {
        final List<UserType> tipoUsuarios = userTypeRepository.findAll(Sort.by("id"));
        return tipoUsuarios.stream()
                .map(tipoUsuario -> mapToDTO(tipoUsuario, new UserTypeDTO()))
                .toList();
    }

    public UserTypeDTO get(final Integer id) {
        return userTypeRepository.findById(id)
                .map(tipoUsuario -> mapToDTO(tipoUsuario, new UserTypeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserTypeDTO userTypeDTO) {
        final UserType tipoUsuario = new UserType();
        mapToEntity(userTypeDTO, tipoUsuario);
        return userTypeRepository.save(tipoUsuario).getId();
    }

    public void update(final Integer id, final UserTypeDTO userTypeDTO) {
        final UserType tipoUsuario = userTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userTypeDTO, tipoUsuario);
        userTypeRepository.save(tipoUsuario);
    }

    public void delete(final Integer id) {
        userTypeRepository.deleteById(id);
    }

    private UserTypeDTO mapToDTO(final UserType tipoUsuario,
                                 final UserTypeDTO userTypeDTO) {
        userTypeDTO.setId(tipoUsuario.getId());
        userTypeDTO.setRole(tipoUsuario.getRole());
        return userTypeDTO;
    }

    private UserType mapToEntity(final UserTypeDTO userTypeDTO,
                                 final UserType tipoUsuario) {
        tipoUsuario.setRole(userTypeDTO.getRole());
        return tipoUsuario;
    }

}
