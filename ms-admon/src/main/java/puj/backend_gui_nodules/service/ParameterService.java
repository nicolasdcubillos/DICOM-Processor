package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.Parameter;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.model.ParameterDTO;
import puj.backend_gui_nodules.repos.ParameterRepository;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ParameterService {

    private final ParameterRepository parameterRepository;
    private final UserRepository userRepository;

    public ParameterService(final ParameterRepository parameterRepository,
                            final UserRepository userRepository) {
        this.parameterRepository = parameterRepository;
        this.userRepository = userRepository;
    }

    public List<ParameterDTO> findAll() {
        final List<Parameter> parameters = parameterRepository.findAll(Sort.by("id"));
        return parameters.stream()
                .map(parameter -> mapToDTO(parameter, new ParameterDTO()))
                .toList();
    }

    public ParameterDTO get(final Integer id) {
        return parameterRepository.findById(id)
                .map(parameter -> mapToDTO(parameter, new ParameterDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ParameterDTO parameterDTO) {
        final Parameter parameter = new Parameter();
        mapToEntity(parameterDTO, parameter);
        return parameterRepository.save(parameter).getId();
    }

    public Parameter update(final Integer id, final ParameterDTO parameterDTO) {
        final Parameter parameter = parameterRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(parameterDTO, parameter);
        parameterRepository.save(parameter);
        return parameter;
    }

    public void delete(final Integer id) {
        parameterRepository.deleteById(id);
    }

    public ParameterDTO mapToDTO(final Parameter parameter, final ParameterDTO parameterDTO) {
        parameterDTO.setId(parameter.getId());
        parameterDTO.setParametro(parameter.getParametro());
        parameterDTO.setValor(parameter.getValor());
        parameterDTO.setDescripcion(parameter.getDescripcion());
        parameterDTO.setUsuarioModifica(parameter.getUserModifica() == null ? null : parameter.getUserModifica().getId());
        return parameterDTO;
    }

    public Parameter mapToEntity(final ParameterDTO parameterDTO, final Parameter parameter) {
        parameter.setParametro(parameterDTO.getParametro());
        parameter.setValor(parameterDTO.getValor());
        parameter.setDescripcion(parameterDTO.getDescripcion());
        final User userModifica = parameterDTO.getUsuarioModifica() == null ? null : userRepository.findById(parameterDTO.getUsuarioModifica())
                .orElseThrow(() -> new NotFoundException("usuarioModifica not found"));
        parameter.setUserModifica(userModifica);
        return parameter;
    }

}
