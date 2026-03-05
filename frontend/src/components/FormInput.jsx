// frontend/src/components/FormInput.jsx (Reusable Component)
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

// Bu import zaten doğruydu, tebrikler!
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const FormInput = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  isRequired = true, 
  name,
  // isFullWidth gibi prop'ları buraya eklersek ve sadece FormControl'e verirsek hata çözülür.
  // Varsayılan olarak isFullWidth zaten FormControl'e uygulanır.
  ...rest // Bileşene gelen diğer prop'ları (örneğin isFullWidth) almak için ekleyebiliriz.
}) => {
  const { isOpen, onToggle } = useDisclosure();
  
  // Eğer type password ise, göz ikonunu göster
  const isPassword = type === 'password';

  return (
    // KRİTİK: isFullWidth zaten otomatik olarak FormControl'den geçirilebilir
    // Ancak dışarıdan gelen isFullWidth'i yakalamak için {...rest} kullanıyorsak, 
    // onu burada yakalamalıyız. isFullWidth'in varsayılanı true'dur.
    <FormControl 
      isRequired={isRequired} 
      id={name} 
      mb={4}
      isFullWidth 
      {...rest} // isFullWidth gibi props'ları FormControl'e yayar (burası güvenli)
    >
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          type={isPassword ? (isOpen ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          size="lg"
          variant="filled"
          borderRadius="md"
          // NOT: Bileşene dışarıdan gelen isFullWidth prop'u buraya gelmeyecektir, 
          // çünkü yukarıda {...rest} içine alınıp FormControl'e yayıldı. 
          // Bu, hatayı çözen temel adımdır!
        />
        {isPassword && (
          <InputRightElement>
            <IconButton
              aria-label={isOpen ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
              onClick={onToggle}
              variant="ghost"
              size="sm"
              mt={2}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default FormInput;