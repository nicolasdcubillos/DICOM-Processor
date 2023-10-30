package puj.backend_gui_nodules.rest;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import puj.backend_gui_nodules.domain.Parameter;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.domain.UserType;
import puj.backend_gui_nodules.model.ParameterDTO;
import puj.backend_gui_nodules.repos.ParameterRepository;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.service.ParameterService;

import java.util.Optional;

import static org.mockito.Mockito.when;
@SpringBootTest
public class ParameterCUResourseTest {

    @Autowired
    private ParameterRepository parameterRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private ParameterService parameterService;

    @BeforeEach
    public void init() {
        this.parameterService = new ParameterService(this.parameterRepository, this.userRepository);
    }

    @Test
    public void testCreatParameter(){
        ParameterDTO parameterDTO = ParameterDTO.builder()
                .parametro("PRUEBA")
                .valor("PRUEBA")
                .descripcion("PRUEBA")
                .usuarioModifica(1)
                .build();
        Integer savedParameter = this.parameterService.create(parameterDTO);
        Assertions.assertThat(savedParameter).isNotNull();
    }

    @Test
    public void testUpdateParameter() {
        int parameterId = 1;
        ParameterDTO parameterDTO = ParameterDTO.builder()
                .parametro("PRUEBA UPDATE")
                .valor("PRUEBA UPDATE")
                .descripcion("PRUEBA UPDATE")
                .usuarioModifica(1)
                .build();

        Parameter savedParameter = this.parameterService.update(parameterId,parameterDTO);
        Assertions.assertThat(savedParameter).isNotNull();
    }
}
