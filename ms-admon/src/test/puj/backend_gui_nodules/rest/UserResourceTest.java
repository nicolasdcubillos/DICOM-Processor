package puj.backend_gui_nodules.rest;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.domain.UserType;
import puj.backend_gui_nodules.model.UserDTO;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.repos.UserTypeRepository;
import puj.backend_gui_nodules.service.UserService;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserResourceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserTypeRepository userTypeRepository;

    @InjectMocks
    private UserService userService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreatUser(){
        User user = User.builder()
                .id(1)
                .nombre("pikachu")
                .apellido("electric")
                .username("algo")
                .pass("algo")
                .email("algo")
                .telefono("algo")
                .tipoUsuario(UserType.builder()
                        .id(1)
                        .rol("admin")
                        .build())
                .build();
        UserDTO userDTO = UserDTO.builder()
                .id(1)
                .nombre("pikachu")
                .apellido("electric")
                .username("algo")
                .pass("algo")
                .email("algo")
                .telefono("algo")
                .tipoUsuario(1)
                .build();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        Integer savedUser = userService.create(userDTO);

        Assertions.assertThat(savedUser).isNotNull();
    }

}